const Issue = require("../models/issue");
const redis = require("../cache/redis");
const { buildKey } = require("../utils/cacheKey");
const { publish, topics } = require("../kafka/producer");
const s3 = require("../storage/s3");
const { v4: uuid } = require("uuid");

const CACHE_TTL = 60;


/* ================= Cache ================= */

async function clearCache() {
  const keys = await redis.keys("issues:*");

  if (keys.length) {
    await redis.del(keys);
  }
}


/* ================= Resolvers ================= */

const resolvers = {

  /* ---------- Queries ---------- */

  Query: {

    getIssues: async (_, { page = 1, limit = 10, filter }, { user }) => {

      const key = buildKey("issues", { page, limit, filter, user });

      const cached = await redis.get(key);

      if (cached) {
        return JSON.parse(cached);
      }

      const where = {};

      /* Role */
      if (user.role === "citizen") {
        where.userId = user.id;
      }

      if (user.role === "authority") {
        where.city = user.city;
      }

      /* Filter */
      if (filter?.status) where.status = filter.status;
      if (filter?.category) where.category = filter.category;

      const offset = (page - 1) * limit;

      const data = await Issue.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const result = {
        rows: data.rows,
        total: data.count,
        page,
        limit,
      };

      await redis.set(
  key,
  JSON.stringify(result),
  "EX",
  CACHE_TTL
);


      return result;
    },


    getStats: async (_, __, { user }) => {

      const where = {};

      if (user.role === "authority") {
        where.city = user.city;
      }

      if (user.role === "citizen") {
        where.userId = user.id;
      }

      const total = await Issue.count({ where });

      const open = await Issue.count({ where: { ...where, status: "Open" } });

      const inProgress = await Issue.count({
        where: { ...where, status: "In Progress" },
      });

      const resolved = await Issue.count({
        where: { ...where, status: "Resolved" },
      });

      const closed = await Issue.count({
        where: { ...where, status: "Closed" },
      });

      return {
        total,
        open,
        inProgress,
        resolved,
        closed,
      };
    },
  },


  /* ---------- Mutations ---------- */

  Mutation: {

    getUploadUrl: async (_, { filename }) => {

      const key = `issues/${uuid()}-${filename}`;

      const url = await s3.getSignedUrlPromise("putObject", {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Expires: 300,
        ContentType: "image/jpeg",
      });

      return { url, key };
    },


    reportIssue: async (_, { issue }, { user }) => {

      if (user.role !== "citizen") {
        throw new Error("Only citizens can report issues");
      }

      const newIssue = await Issue.create({
        title: issue.title,
        description: issue.description,
        category: issue.category,
        location: issue.location,
        city: issue.city,
        latitude: issue.latitude,
        longitude: issue.longitude,
        imageUrls: issue.imageUrls,

        userId: user.id,
        status: "Open",
      });

      await clearCache();

      await publish(topics.CREATED, newIssue);

      return newIssue;
    },


    updateIssueStatus: async (_, { id, status, note }, { user }) => {

      if (user.role !== "authority") {
        throw new Error("Only authority allowed");
      }

      const issue = await Issue.findByPk(id);

      if (!issue) throw new Error("Issue not found");

      if (issue.city !== user.city) {
        throw new Error("Unauthorized");
      }

      issue.status = status;
      issue.resolutionNote = note;

      await issue.save();

      await clearCache();

      await publish(topics.UPDATED, issue);

      return issue;
    },
  },
};

module.exports = resolvers;
