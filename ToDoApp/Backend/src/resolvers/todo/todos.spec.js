const {
    mergeResolvers
} = require("merge-graphql-schemas");
const {
    createTestClient
} = require('apollo-server-testing');
const {
    ApolloServer,
    gql,
    makeExecutableSchema
} = require('apollo-server');
const {
    typeDefs
} = require("../../schema/typeDefs");
const {
    userResolver
} = require("../user/userResolver");
const {
    todoResolver
} = require("./todoResolver");
const {
    augmentSchema
} = require("neo4j-graphql-js");
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'password'), {
        disableLosslessIntegers: true
    }
)
const resolvers = mergeResolvers([userResolver, todoResolver]);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const augmentedSchema = augmentSchema(schema);

const server = new ApolloServer({
    schema: augmentedSchema,
    context: {
        driver
    }
});

const {
    query,
    mutate
} = createTestClient(server);

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

describe('mutate', () => {
    var logInToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6InlvdXJAZW1haWwuY29tIiwiaWF0IjoxNTc3MTE3OTQxLCJleHAiOjE2MDg2NzU1NDF9.zf7lZRXKoljUuVZMHTdIH0kD7F8t8qZPmoA6A3sqKHg";
    describe('given user is not logged in/no token', () => {
        it('creating a todo returns an error', async () => {
            const res = await mutate({
                mutation: CREATE_TODO,
                variables: {
                    message: "neues Todo",
                    token: ""
                }
            });
            expect(res.errors).toHaveLength(1);
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
            expect(res.data.addTodo[0].message).toEqual("neues Todo");
        });
        describe('Modifying Todos', () => {
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
            describe('given the loggedIn-User is NOT the creator of the todo (NOT allowed to modify)', () => {
                it('does not delete the todo', async () => {
                    const res = await mutate({
                        mutation: DELETE_TODO,
                        variables: {
                            id: "2",
                            token: logInToken
                        }
                    });
                    expect(res.data.deleteTodo).toBeNull();
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
                      todoById(id:"1") {
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
        mutation deleteTodo($id: String, $token:String) {
            deleteTodo(id: $id, token:$token)
            {
              id
              message
            }
        }
    `;

const UPDATE_TODO_MESSAGE = gql `
          mutation updateTodo( $id: String, $message: String, $finished: Boolean, $token:String) {
              updateTodo(id: $id, message: $message, finished:$finished, token:$token)
              {
                message
              }
          }
  `;