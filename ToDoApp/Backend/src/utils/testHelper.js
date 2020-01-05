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
const bcrypt = require('bcryptjs')
const { generateUUID } = require("../../utils.js");


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

const cleanDatabase = async (options={}) => {
  const session = driver.session()
  try {
    await session.writeTransaction(transaction => {
      return transaction.run(        `
          MATCH (everything)
          DETACH DELETE everything
        `,
      )
    })
  } finally {
    session.close()
  }
}


const createUser = async (params) => {
    const session = driver.session()
    if (params.id == null) userID = generateUUID();
        else userID = params.id;

    try {
        await session.writeTransaction(transaction => {
            return transaction.run(
                'CREATE (u:User {id: $id, name: $name, email: $email ,password: $password })', {
                    id: userID,
                    name: params.name,
                    email: params.email,
                    password: bcrypt.hash(params.password, 10).toString(),
                })
        })
    } finally {
        await session.close()
    }
}

const createTodo = async (params) => {
    const session = driver.session()
    if (params.id == null) todoID = generateUUID();
            else todoID = params.id;
    try {
        await session.writeTransaction(transaction => {
            return transaction.run(
                'CREATE (t: Todo {id: $id, message: $message, finished: $finished}) WITH t MATCH (u:User{id:$userId}) MERGE (u)-[:PUBLISHED]->(t)',{
                    id: todoID,
                    message: params.message,
                    finished: params.finished,
                    userId:params.userId

                }
            )
        })
    } finally {
       await session.close()
    }
}



module.exports.getTestApolloServer = getTestApolloServer;
module.exports.cleanDatabase = cleanDatabase;
module.exports.createUser = createUser;
module.exports.createTodo = createTodo;