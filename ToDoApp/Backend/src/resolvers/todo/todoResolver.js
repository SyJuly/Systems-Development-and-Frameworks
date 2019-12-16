const { find }= require('lodash');
const { generateUUID }= require("../../../utils.js");
const jwt = require('jsonwebtoken')
const { CONFIG }= require("../../config/config");
const { neo4jgraphql } = require('neo4j-graphql-js');


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const todoResolver = {
    Query: {
        allTodos(object, params, ctx, resolveInfo) {
          return neo4jgraphql(object, params, ctx, resolveInfo);
        },
        todoById: async (root, {id}, context) => {
          const session = context.driver.session();
          const queryResults = await session.run(`MATCH (t${id}:Todo{id:${id}}) RETURN t${id}`);
          session.close();
          const todo = queryResults.records.map(todo => todo.get(`t${id}`).properties)
          return todo[0];
        },
    },
    Mutation: {
        addTodo: async (_, { message, token }, context) => {
          const decoded = jwt.verify(token, CONFIG.JWT_SECRET)
          const userId = decoded.id
          const session = context.driver.session();
          const todo = {
            id: generateUUID(),
            message: message,
            finished: false
          }
          await session.run(
              'CREATE (t:Todo {id: $id, message: $message, finished: $finished})\n' +
              'WITH t \n' +
              'MATCH (u:User{id:$userId})\n' +
              'MERGE (u)-[:PUBLISHED]->(t)\n',
              {...todo, userId}
          );
          session.close()
          return [todo];

        },
        updateTodo: async (_, {id, token, message, finished}, context) => {
          const decoded = jwt.verify(token, CONFIG.JWT_SECRET)
          const userId = decoded.id
          const session = context.driver.session();
          const queryResults = await session.run(
              'MATCH (t:Todo{id:$todoId}) <-[r:PUBLISHED]-(u:User{id:$userId}) RETURN t',
              {
                todoId: id,
                userId
              }
          )
          const todo = queryResults.records.map(todo => todo.get(`t`).properties)[0];
          if (todo == null) {
            throw new Error(`Your are not the creator of todo:  id ${id}`);
          }

          let updatedTodo = {...todo};
          updatedTodo.message = message;
          updatedTodo.finished = finished;
          await session.run(
              'MATCH (t:Todo{id:$id}) \n' +
              'SET t = {id: $id, message: $message, finished:$finished}',
              updatedTodo
          )
          session.close();
          return updatedTodo;
        },
        deleteTodo: async (_, {id, token}, context) => {
            const decoded = jwt.verify(token, CONFIG.JWT_SECRET)
            const userId = decoded.id
            const session = context.driver.session();
            const queryResults = await session.run(
                'MATCH (t:Todo{id:$todoId}) <-[r:PUBLISHED]-(u:User{id:$userId}) RETURN t',
                {
                  todoId: id,
                  userId
                }
            )
            const todo = queryResults.records.map(todo => todo.get(`t`).properties)[0];
            console.log(todo)
            if (todo == null) {
              throw new Error(`Your are not the creator of todo or this node has been deleted:  id ${id}`);
            }
            await session.run(
                'MATCH (t:Todo{id:$todoId}) DETACH DELETE t',
                { todoId: id }
            )
            session.close();
            return todo;
        }
    }
};
module.exports.todoResolver = todoResolver;
