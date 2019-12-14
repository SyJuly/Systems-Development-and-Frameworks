const { find }= require('lodash');
const { generateIntID }= require("../../../utils.js");
const jwt = require('jsonwebtoken')
const { CONFIG }= require("../../config/config");

let todos = [{
        id: 1,
        message: 'first todo',
        finished: false,
        creator: 1
    },
    {
        id: 2,
        message: 'second todo',
        finished: true,
        creator: 2
    },
];


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const todoResolver = {
    Query: {
        allTodos: () => todos,
        todoById: (root, args,) => {
            return find(todos, { id: args.id });
        },
    },
    Mutation: {
        addTodo: (_, { message, token }) => {
          const decoded = jwt.verify(token, CONFIG.JWT_SECRET)
          const userId = decoded.id
            todos.push({
                id: generateIntID(),
                message: message,
                finished: false,
                creator: userId
            });
            return todos;
        },
        updateTodo: (_, {id, token, message, finished}) => {
          const decoded = jwt.verify(token, CONFIG.JWT_SECRET)
          const userId = decoded.id
            const todo = find(todos, {id: id});
            if (todo.creator !== userId) {
                throw new Error(`Your are not the creator of todo:  id ${id}`);
            }
            todo.message = message;
            todo.finished = finished;
            return todo;
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
