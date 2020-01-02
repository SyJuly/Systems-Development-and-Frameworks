const { rule, shield, not } =  require('graphql-shield');

const isAuthenticated = rule()(async (parent, args, context) => {
  return context.authentication !== null || context.authentication !== undefined || context.authentication != {};
});

const permissions = shield({
      Query: { },
      Mutation: {
        addTodo: isAuthenticated,
        updateTodo: isAuthenticated,
        deleteTodo: isAuthenticated,
        login: not(isAuthenticated),
      },
    }

);

module.exports = permissions;