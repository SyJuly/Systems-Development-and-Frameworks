const { gql } = require('apollo-server');
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`


  type Todo {
    id: Int!
    message: String
    assignee: Assignee
  }
  type Assignee {
    name: String
    todos: [Todo]
  }
  type Query {
    todos: [Todo]
    assignees : [Assignee]
  }
  type Mutation {
    addTodo(id: Int, message: String, assignee: String): Todo
    updateTodo( id: Int!, message: String,assignee: String): Todo
  }
`;


module.exports.typeDefs = typeDefs;
