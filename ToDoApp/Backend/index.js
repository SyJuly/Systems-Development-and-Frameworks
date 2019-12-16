import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'
const { ApolloServer } = require('apollo-server');
const { mergeResolvers } = require("merge-graphql-schemas");
const { getContext } = require("./src/helpers/contextHelper");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const { typeDefs } = require('./src/schema/typeDefs');


const { userResolver } = require("./src/resolvers/user/userResolver");
const { todoResolver } = require("./src/resolvers/todo/todoResolver");
const resolvers = mergeResolvers([userResolver, todoResolver]);

const schema = makeExecutableSchema({ typeDefs, resolvers })
const server = new ApolloServer({
  schema, context: ({ req }) => {
    return getContext(req)
  }
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
