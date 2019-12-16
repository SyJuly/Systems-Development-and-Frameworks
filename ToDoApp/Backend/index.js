const { ApolloServer, makeExecutableSchema } = require('apollo-server');
const { mergeResolvers } = require("merge-graphql-schemas");
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'password')
)

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const { typeDefs } = require('./src/schema/typeDefs');


const { userResolver } = require("./src/resolvers/user/userResolver");
const { todoResolver } = require("./src/resolvers/todo/todoResolver");
const resolvers = mergeResolvers([userResolver, todoResolver]);


const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema, context: { driver } });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
