const { rule, shield, not } =  require('graphql-shield');
const { isEmptyObject } =  require('../utils/helpers');

const isAuthenticated = rule()(async (parent, args, context) => {
  return context.auth !== null && context.auth !== undefined && !isEmptyObject(context.auth)
});

const permissions = shield({
  Query: {
  },
      Mutation: {
        addTodo: isAuthenticated,
        updateTodo: isAuthenticated,
        deleteTodo: isAuthenticated,
        login: not(isAuthenticated),
      },
    }

);

module.exports.permissions = permissions;