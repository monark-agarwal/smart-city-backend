const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Issue {
  id: ID!
  title: String
  description: String
  category: String
  status: String
  city: String
  location: String
  latitude: Float
  longitude: Float
  imageUrls: [String]
  resolutionNote: String
  createdAt: String
}


type IssuePage {
  rows: [Issue]
  total: Int
  page: Int
  limit: Int
}


type IssueStats {
  total: Int
  open: Int
  inProgress: Int
  resolved: Int
  closed: Int
}


input Filter {
  status: String
  category: String
}


type UploadUrl {
  url: String
  key: String
}


input IssueInput {
  title: String!
  description: String!
  category: String!
  location: String!
  city: String!
  latitude: Float!
  longitude: Float!
  imageUrls: [String]
}


type Query {

  getIssues(
    page: Int
    limit: Int
    filter: Filter
  ): IssuePage

  getStats: IssueStats
}


type Mutation {

  getUploadUrl(filename: String!): UploadUrl

  reportIssue(issue: IssueInput!): Issue

  updateIssueStatus(
    id: ID!
    status: String!
    note: String
  ): Issue
}

`);
