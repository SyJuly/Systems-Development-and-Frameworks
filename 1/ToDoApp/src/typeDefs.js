const { gql } = require('apollo-server');
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Todo {
    id: Int!
    message: String
    finished: Boolean
  }
  type Query {
    todoById(id: Int!): Todo
    allTodos: [Todo]
  }
  type Mutation {
    addTodo( message: String): [Todo]
    updateTodo( id: Int!, message: String , finished: Boolean): Todo
    deleteTodo(id: Int): [Todo]
  }
`;

module.exports.typeDefs = typeDefs;
