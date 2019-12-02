const { find,filter }= require('lodash');



const todos = [{
        id: 1,
        message: 'first todo',
        finished: false
    },
    {
        id: 2,
        message: 'second todo',
        finished: true
    },
];
var maxId = 2;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        allTodos: () => todos,
        todoById: (root, args, context, info) => {
            return find(todos, { id: args.id });
        },
    },
    Mutation: {
        addTodo: (_, { message }) => {
            todos.push({
                id: maxId + 1,
                message: message,
                finished: false
            });
            maxId += 1;
            return todos;
        },
        updateTodo: (_, {id, message, finished}) => {
            const todo = find(todos, {id: id});
            if (!todo) {
                throw new Error(`Couldn’t find todo with id ${id}`);
            }
            todo.message = message;
            todo.finished = finished;
            return todo;
        },
        deleteTodo: (_, {id}) => {
            todos.splice(id, 1)
            return todos;
        }
    }
};
module.exports.resolvers = resolvers;
