const { find, filter } = require('lodash');
const todos = [
  {
    id:1,
    message: 'first todo',
    assignee: {name:'Eva'},
  },
  {
    id:2,
    message: 'second todo',
    assignee: {name:'1'},
  },
];
const assignees=[
    {
      name:'Eva',
    },
    {
      name:'1',
    },
]

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    todos: () => todos,
    assignees: () => assignees,
  },
  Mutation:{
    addTodo:(object, input) =>{
     todos.push({
        message: input.message,
        assignee: {name: input.name}
               });
       },
       updateTodo: (_, { id, message, assignee }) => {
        const todo = find(todos, { id: id });
        if (!todo) {
          throw new Error(`Couldn’t find todo with id ${id}`);
        }
        todo.message = message;
        todo.assignee = assignee;
        return todo;
       }
  }

};
module.exports.resolvers = resolvers;
