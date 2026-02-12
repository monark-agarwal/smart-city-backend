require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const sequelize = require("./db/connection");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const authMiddleware = require("./middleware/auth");
const { connectProducer } = require("./kafka/producer");

const app = express();


/* Middlewares */
app.use(cors());
app.use(express.json());
app.use(authMiddleware);


/* Start Server */
async function start() {

  await sequelize.sync();

  await connectProducer();


  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });


  await server.start();


  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({
        user: req.user,
      }),
    })
  );


  app.listen(4000, () => {
    console.log("?? Issue Service running on port 4000");
  });
}

start();