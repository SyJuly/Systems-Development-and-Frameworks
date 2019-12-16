const { ApolloServer, makeExecutableSchema } = require('apollo-server');
const { mergeResolvers } = require("merge-graphql-schemas");
const neo4j = require('neo4j-driver');
const { augmentSchema } = require("neo4j-graphql-js");
const { seedDatabase } = require("./src/db/seed");

const driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'password'),
    { disableLosslessIntegers: true }
)

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const { typeDefs } = require('./src/schema/typeDefs');


const { userResolver } = require("./src/resolvers/user/userResolver");
const { todoResolver } = require("./src/resolvers/todo/todoResolver");
const resolvers = mergeResolvers([userResolver, todoResolver]);


const schema = makeExecutableSchema({ typeDefs, resolvers });
const augmentedSchema = augmentSchema(schema);

const server = new ApolloServer({ schema: augmentedSchema, context: { driver } });


if (process.argv.length === 3 && process.argv[2] === "--seed") {
  seedDatabase(driver)
}

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
