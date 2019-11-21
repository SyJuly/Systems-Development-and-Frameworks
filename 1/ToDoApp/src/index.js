const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Todo" type defines the queryable fields for every todo in our data source.
  type Todo {
    id: String
    message: String
    assignee: Assignee
  }
  type Assignee {
    name: String
    todos: [Todo]
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "todo" query returns an array of zero or more Todos (defined above).
  type Query {
    getTodos: [Todo]
    getAssignees : [Assignee]
  }
  type Mutation {
    addTodo(id: String, message: String, assignee: String): Todo
  }
  
`;
const todos = [
  {
    message: 'first todo',
    assignee: 'Eva'
  },
  {
    message: 'second todo',
    assignee: 'Eva'
  },
];
const assignees = [
  {
   name: 'Eva'
  },
  {
    name: 'Jule'

  },
];
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    getTodos: () => todos,
    getAssignees: () => assignees,
  }

};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

