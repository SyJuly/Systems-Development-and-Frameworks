const { ApolloServer } = require('apollo-server');
const { mergeResolvers } = require("merge-graphql-schemas");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const { typeDefs } = require('./schema/typeDefs');


const { userResolver } = require("./resolvers/user/userResolver");
const { todoResolver } = require("./resolvers/todo/todoResolver");
const resolvers = mergeResolvers([userResolver, todoResolver]);


const server = new ApolloServer({ typeDefs, resolvers});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
