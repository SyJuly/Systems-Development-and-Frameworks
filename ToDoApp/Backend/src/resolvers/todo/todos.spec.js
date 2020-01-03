const { createTestClient } = require('apollo-server-testing');
const { gql} = require('apollo-server');
const { getTestApolloServer } = require('../../utils/testHelper');

const clientLoggedOut = createTestClient(getTestApolloServer(false));

const clientLoggedIn= createTestClient(getTestApolloServer(true));

/**
describe('query', () => {
    describe('todos', () => {
        it('querying all todos returns only 1 Todo because of limit', async () => {
            const res = await query({
                query: GET_ALL_TODOS
            });
            expect(res.data.allTodos).toHaveLength(1);
        });
        it('returns todo-message for given id', async () => {
            const res = await query({
                query: GET_FIRST_TODOMESSAGE
            });
            expect(res.data.todoById).toMatchObject({
                message: "first todo"
            });
        });
    });
});
**/
describe('mutate', () => {

  describe('given user is not logged in/no token', () => {
        it('creating a todo returns an error', async () => {
            const res = await clientLoggedOut.mutate({
                mutation: CREATE_TODO,
                variables: {
                    message: "neues Todo"
                }
            });
            expect(res.errors).toHaveLength(1);
        });
    });
    describe('give user is loggedIn', () => {
        it('adds a todo', async () => {
            const res = await clientLoggedIn.mutate({
                mutation: CREATE_TODO,
                variables: {
                    message: "neues Todo"
                }
            });
            expect(res.data.addTodo[0].message).toEqual("neues Todo");
        });
        describe('Modifying Todos', () => {
         /**
            describe('given the loggedIn-User is the creator of the todo (allowed to modify)', () => {

                it('updates todo message ', async () => {
                    const res = await mutate({
                        mutation: UPDATE_TODO_MESSAGE,
                        variables: {
                            id: "1",
                            message: "kleines Update",
                            finished: false,
                            token: logInToken
                        }
                    });
                    expect(res.data.updateTodo.message).toEqual("kleines Update");
                });
                it('deletes todo ', async () => {
                    const res = await mutate({
                        mutation: DELETE_TODO,
                        variables: {
                            id: "1",
                            token: logInToken
                        }
                    });
                    expect(res.data.deleteTodo.id).toEqual("1");

                });

            });
              **/
            describe('given the loggedIn-User is NOT the creator of the todo (NOT allowed to modify)', () => {
                it('does not delete the todo', async () => {
                    const res = await clientLoggedIn.mutate({
                        mutation: DELETE_TODO,
                        variables: {
                            id: "2"
                        }
                    });
                    expect(res.data.deleteTodo).toBeNull();
                });
            });
        });
    });
});

const LOGIN = gql `
      mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password)
      }
  `;

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
                      todoById(id:"1") {
                        message
                      }
                    }
                  `;

const CREATE_TODO = gql `
                mutation addTodo($message: String){
                   addTodo(message: $message)
                    {
                      message
                    }
                  }
                `;

const DELETE_TODO = gql `
        mutation deleteTodo($id: String) {
            deleteTodo(id: $id)
            {
              id
              message
            }
        }
    `;

const UPDATE_TODO_MESSAGE = gql `
          mutation updateTodo( $id: String, $message: String, $finished: Boolean) {
              updateTodo(id: $id, message: $message, finished:$finished)
              {
                message
              }
          }
  `;