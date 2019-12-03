const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server');
const { typeDefs } = require("../../schema/typeDefs");
const { resolvers } = require("./resolvers/resolvers");

    const server = new ApolloServer({
      typeDefs,
       resolvers
    });
    const { query, mutate } = createTestClient(server);

     it('returns todo-message for given id', async () => {
        const FIND_FIRST_TODO = gql`
            query {
              todoById(id:1) {
                message
              }
            }
          `;
         const {
         data : {findTodo}
         }  = await query({query : FIND_FIRST_TODO});
         expect(findTodo).toEqual({message:"first todo"});
         });

    it('deletes entries', async () => {
    const DELETE_SECOND_TODO = gql`
        mutation {
          deleteTodo(id:1) {
            message
          }
        }
      `;
     const {
     data : {deleteTodo}
     }  = await mutate({mutation : DELETE_SECOND_TODO});
     expect(deleteTodo).toEqual([{message:"first todo"}]);
     });


/**
    it('initiates 2 todos', async () => {
     const res = await query({ query: allTodos});
     expect(res).toMatchObject({
                                  "data": {
                                    "allTodos": [
                                      {
                                        "id": 1,
                                        "message": "first todo"
                                      },
                                      {
                                        "id": 2,
                                        "message": "second todo"
                                      }
                                    ]
                                  }
                                }
     );
    });

    it('returns todo-message for given id', async() => {
    const res = await query({ query: todoById(1){message}});
    expect(res).toMatchObject({
                                "data": {
                                  "todoById": {
                                      "message": "first todo"
                                  }
                                }
                              });

    })
    **/



