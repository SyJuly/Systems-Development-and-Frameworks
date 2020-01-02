const { generateUUID }= require("../../../utils.js");

const todoResolver = {
    Query: {
        allTodos: async (parent, args, context) => {
         const session = context.driver.session();
         const queryResults = await session.run('MATCH(t:Todo) RETURN t LIMIT 1');
         const todos = queryResults.records.map(todo => todo.get('t').properties);
         session.close()
         return todos;
        },
        todoById: async (root, {id}, context) => {
                  const session = context.driver.session();
                  const queryResults = await session.run('MATCH (t:Todo {id: $id}) RETURN t',
                  {
                    id:id
                  });
                  session.close();
                  const todo = queryResults.records.map(todo => todo.get('t').properties)
                  return todo[0];
                },
    },
    Mutation: {
        addTodo: async (_, { message, token }, context) => {
          const userId = context.authorization.userId;
          console.log(userId);
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
          const userId = context.authorization.userId;
          const session = context.driver.session();
          const queryResults = await session.run(
              'MATCH (t:Todo{id:$todoId}) <-[r:PUBLISHED]-(u:User{id:$userId}) RETURN t',
              {
                todoId: id,
                userId
              }
          )
          const todo = queryResults.records.map(todo => todo.get('t').properties)[0];
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
            const userId = context.authorization.userId;
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
