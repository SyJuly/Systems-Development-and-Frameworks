const { mergeResolvers } = require("merge-graphql-schemas");
const { ApolloServer, makeExecutableSchema} = require('apollo-server');
const { typeDefs } = require("../schema/typeDefs");
const { userResolver } = require("../resolvers/user/userResolver");
const { todoResolver } = require("../resolvers/todo/todoResolver");
const { augmentSchema } = require("neo4j-graphql-js");
const neo4j = require('neo4j-driver');
const { getToken } = require('./auth')
const { users } = require('../db/data')
const { applyMiddleware } = require ('graphql-middleware');
const { permissions } = require ('../config/permissions');

const driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'password'), {
      disableLosslessIntegers: true
    }
)
const resolvers = mergeResolvers([userResolver, todoResolver]);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});
const augmentedSchema = augmentSchema(applyMiddleware(schema, permissions));

const getTestApolloServer = (loggedIn ) => {
  return new ApolloServer({
    schema: augmentedSchema,
    context: {
      driver,
      auth: loggedIn ? getTestAuthorizationObject() : {}
    }
  })
}

const getTestAuthorizationObject = () => {
  return {
    token: getToken(users[0].id, users[0].email),
    userId: users[0].id,
  }
}


module.exports.getTestApolloServer = getTestApolloServer;