const { createTestClient } = require('apollo-server-testing');
const { gql } = require('apollo-server');
const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");

describe ("query"), () => {
    // create a test server to test against, using our production typeDefs,
    // resolvers, and dataSources.
    const server = new ApolloServer({
      typeDefs,
       resolvers
    });

  //  const { query, mutate } = createTestClient(server);

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

    it('returns')

};
