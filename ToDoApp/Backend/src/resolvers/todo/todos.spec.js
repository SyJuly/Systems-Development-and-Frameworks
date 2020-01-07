const { createTestClient } = require('apollo-server-testing');
const { gql} = require('apollo-server');
const { getTestApolloServer,cleanDatabase,createUser,createTodo } = require('../../utils/testHelper');

const clientLoggedIn = createTestClient(getTestApolloServer(true));
const clientLoggedOut = createTestClient(getTestApolloServer(false));

afterEach(async (done) => {
    await cleanDatabase()
    done()
})

beforeEach(async (done) => {
    await createUser({ id: "1",  name: 'First Testuser', email: 'first@email.com', password: 'password'  })
    await createTodo({ id: "1",message: 'first todo', finished: false,userId: "2"  })
    await createTodo({ id: "2",message: 'second todo', finished: false, userId: "1" })
    done()
})
describe('Todos', () => {
    describe('user is not logged in', () => {
        it('creating a todo returns an error', async () => {
            await expect(clientLoggedOut.mutate({
                mutation: CREATE_TODO,
                variables: {
                    message: "neues Todo"
                }
            })).resolves.toMatchObject({
                data: {addTodo: null}
            })
        });
        it('query returns todo-message for given id', async () => {
            await expect(clientLoggedOut.query({
                query: GET_TODOMESSAGE_BYID,
                variables: {
                    id: "1"
                }
            })).resolves.toMatchObject({
                data: {
                    todoById: {
                        message: "first todo"
                    }
                },
                errors: undefined
            })
        });
        it('query all todos ', async () => {
            const res = await clientLoggedOut.query({
                query: GET_ALL_TODOS
            });
            expect(res.data.allTodos).toHaveLength(2);
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
        describe('given the loggedIn-User is the creator of the todo (allowed to modify)', () => {
            it('deletes todo ', async () => {
                await expect(clientLoggedIn.mutate({
                    mutation: DELETE_TODO,
                    variables: {
                        id: "2"
                    }
                })).resolves.toMatchObject({
                    data: {
                        deleteTodo: {
                            id: "2"
                        }
                    },
                    errors: undefined
                })
            });
        });

        describe('given the loggedIn-User is NOT the creator of the todo (NOT allowed to modify)', () => {
            it('does not delete the todo', async () => {
                await expect(clientLoggedIn.mutate({
                    mutation: DELETE_TODO,
                    variables: {
                        id: "1"
                    }
                })).resolves.toMatchObject({
                    data: {
                        deleteTodo: null
                    }
                })
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

const GET_TODOMESSAGE_BYID = gql `
                    query addTodo($id: String!){
                          todoById(id: $id) {
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