const { buildSchema } = require('graphql');const schema=buildSchema(`
type Issue { id: ID!, title: String!, description: String!, category: String!, status: String!, location: String!, imageUrls: [String] }
type Query { getIssues:[Issue], getIssue(id:ID!):Issue }
input IssueInput { title:String!, description:String!, category:String!, location:String!, imageUrls:[String] }
type Mutation { reportIssue(issue:IssueInput!):Issue, updateIssueStatus(id:ID!, status:String!):Issue }
`);module.exports=schema;
