const { find }= require('lodash');
const { generateIntID, createTodo }= require("../../../utils.js");
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
            id: generateIntID(),
            message: message,
            finished: false
          }
          try {
            await session.run(
                'CREATE (t$id:Todo {id: $id, message: $message, finished: $finished}) RETURN t$id',
                {
                  id:todo.id,
                  message:todo.message,
                  finished:todo.finished
                }
            );
          } finally {
            session.close()
          }

          const createPublishedRealtion = context.driver.session();
          try {
            await createPublishedRealtion.run(
                'MATCH (u:User{id:$userId}), (t:Todo{id:$todoId}) \n' +
                'MERGE (u)-[:PUBLISHED]->(t)\n',
                {
                  userId,
                  todoId: todo.id
                }
            );
          } finally {
            createPublishedRealtion.close()
          }

          return [todo];

        },
        updateTodo: async (_, {id, token, message, finished}, context) => {
          const decoded = jwt.verify(token, CONFIG.JWT_SECRET)
          const userId = decoded.id
          const session = context.driver.session();
          let updatedTodo = {};
          try {
            const queryResults = await session.run(`MATCH (t${id}:Todo{id:${id}}) RETURN t${id}`);
            const todo = queryResults.records.map(todo => todo.get(`t${id}`).properties)[0];
            /*if (todo.creator !== userId) {
              throw new Error(`Your are not the creator of todo:  id ${id}`);
            }*/

            updatedTodo = {...todo};
            updatedTodo.message = message;
            updatedTodo.finished = finished;
          } finally{
            session.close();
          }

          const updateTodoSession = context.driver.session();
          try {
            console.log(updatedTodo);
            await updateTodoSession.run(
                'MATCH (t:Todo{id:$id}) \n' +
                'SET t = {id: $id, message: $message, finished:$finished}',
                {
                  id:updatedTodo.id,
                  message: updatedTodo.message,
                  finished: updatedTodo.finished
                }
            );
          } finally {
            updateTodoSession.close()
          }

          return updatedTodo;
        },
        deleteTodo: (_, {id, token}) => {
            const decoded = jwt.verify(token, CONFIG.JWT_SECRET)
            const userId = decoded.id
            const todo= find(todos, {id: id })
            if(todo.creator === userId){
              const index = todos.map(todo => {
                return todo.id;
              }).indexOf(id);
              if (index > -1) {
                return todos.splice(index, 1);
              }
            }
            return todos;
        }
    }
};
module.exports.todoResolver = todoResolver;
