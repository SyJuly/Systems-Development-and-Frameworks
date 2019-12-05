const { mergeResolvers } = require("merge-graphql-schemas");
const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server');
const { typeDefs } = require("../../schema/typeDefs");
const { userResolver } = require("../user/userResolver");
const { todoResolver } = require("../todo/todoResolver");

const resolvers = mergeResolvers([userResolver, todoResolver]);

const server = new ApolloServer({typeDefs, resolvers});
const { query, mutate } = createTestClient(server);

describe('query', () => {
    describe('todos', () => {

        it('todo_list has 2 initial todos', async () => {
            const res = await query({
                query: GET_ALL_TODOS
            });
            expect(res.data.allTodos).toHaveLength(2);
        });

        it('returns todo-message for given id', async () => {
            const firstTodo = {
                "data": {
                    "todoById": {
                        "message": "first todo"
                    }
                }
            };
            const res = await query({
                query: GET_FIRST_TODOMESSAGE
            });
            expect(res).toMatchObject(firstTodo);
        });
    });
});

describe('mutate', () => {
    var logInToken = "";
    describe('given user is not logged in/no token', () => {
        it('creating a todo returns an error', async () => {
            const res = await mutate({
                mutation: CREATE_TODO,
                variables: {
                    message: "neues Todo",
                    token: logInToken
                }
            });
            expect(res.errors).toHaveLength(1);
        });
        it('logIn with correct credentials returns token-String', async () => {
            const res = await mutate({
                mutation: LOGIN,
                variables: {
                    email: "your@email.com",
                    password: "password"
                }
            });
            expect(res.data.login).toBeDefined();
            logInToken = res.data.login;
        });
    });
    describe('give user is loggedIn', () => {
        it('adds a todo', async () => {
            const res = await mutate({
                mutation: CREATE_TODO,
                variables: {
                    message: "neues Todo",
                    token: logInToken
                }
            });
            expect(res).toMatchObject({
                "data": {
                    "addTodo": [{
                            "message": "first todo"
                        },
                        {
                            "message": "second todo"
                        },
                        {
                            "message": "neues Todo"
                        }
                    ]
                }
            });

        });
        describe('Modifying Todos', () => {
            describe('given the loggedIn-User is the creator of the todo (allowed to modify)', () => {

                it('updates todo message ', async () => {
                    const res = await mutate({
                        mutation: UPDATE_TODO_MESSAGE,
                        variables: {
                            id: 1,
                            message: "kleines Update",
                            finished: false,
                            token: logInToken
                        }
                    });
                    expect(res).toMatchObject({
                        "data": {
                            "updateTodo": {
                                "message": "kleines Update"
                            }
                        }
                    });
                });

                it('deletes todo ', async () => {
                    const res = await mutate({
                        mutation: DELETE_TODO,
                        variables: {
                            id: 1,
                            token: logInToken
                        }
                    });
                    expect(res.data.deleteTodo).toHaveLength(1);
                });
            });
            describe('given the loggedIn-User is NOT the creator of the todo (NOT allowed to modify)', () => {
                it('does not delete the todo', async () => {
                    const res = await mutate({
                        mutation: DELETE_TODO,
                        variables: {
                            id: 2,
                            token: logInToken
                        }
                    });
                    expect(res.data.deleteTodo).toHaveLength(2);
                });
            });
        });
    });
});

const GET_ALL_TODOS = gql `
                         query {
                              allTodos {
                                  id
                                  message
                                }
                              }
                            `;

const GET_FIRST_TODOMESSAGE = gql `
                    query {
                      todoById(id:1) {
                        message
                      }
                    }
                  `;

const CREATE_TODO = gql `
                mutation addTodo($message: String, $token: String){
                   addTodo(message: $message , token: $token)
                    {
                      message
                    }
                  }
                `;

const DELETE_TODO = gql `
        mutation deleteTodo($id: Int, $token:String) {
            deleteTodo(id: $id, token:$token)
            {
              id
              message
            }
        }
    `;

const UPDATE_TODO_MESSAGE = gql `
          mutation updateTodo( $id: Int, $message: String, $finished: Boolean, $token:String) {
              updateTodo(id: $id, message: $message, finished:$finished, token:$token)
              {
                message
              }
          }
  `;

const LOGIN = gql `
      mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password)
      }
  `;
