const todos = [
  {
    message: 'first todo',
    assignee: {name:'Eva'},
  },
  {
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
       }
  }

};
module.exports.resolvers = resolvers;
