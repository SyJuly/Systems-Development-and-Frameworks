const { gql } = require('apollo-server');
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Todo {
    id: String!
    message: String
    finished: Boolean
    creator: [User]
  }
  type User {
    id: String!
    name: String
    email: String
    password: String
  }
  type Query {
    todoById(id: String!): Todo
    allTodos: [Todo]
    allUsers: [User]
  }
  type Mutation {
    addTodo( message: String, token: String): [Todo]
    updateTodo( id: String, message: String , finished: Boolean, token: String): Todo
    deleteTodo(id: String, token: String): [Todo]
    login(email: String!, password: String!): String!
    signup(name: String!, email: String!, password: String!): String!
  }
`;

module.exports.typeDefs = typeDefs;
