const { createTestClient } = require('apollo-server-testing');
const { gql} = require('apollo-server');
const { getTestApolloServer } = require('../../utils/testHelper');

const {
    query,
    mutate
} = createTestClient(getTestApolloServer(false));

/**
describe('query', () => {
    it('gets user by ID', async () => {
        const res = await query({
            query: USER_BY_ID,
            variables: {
                id: "1"
            }
        });
        expect(res.data.userById.email).toEqual("your@email.com");
    });
    describe('user-list', () => {
        it('is sorted by names ', async () => {
            const res = await query({
                query: GET_ALL_USERS
            });
            expect(res.data.allUsers[0].name).toEqual("anna testuser");
        });
    });

});
**/
describe('mutate', () => {
    describe('user ', () => {
    /**
        it('signup returns error when email is already in use', async () => {
            const res = await mutate({
                mutation: SIGNUP,
                variables: {
                    name: "eva",
                    email: "your@email.com",
                    password: "password"
                }
            });
            expect(res.errors).toHaveLength(1);
        });
        **/
        it('signup returns token-String when email is not already in use', async () => {
            const res = await mutate({
                mutation: SIGNUP,
                variables: {
                    name: "eva",
                    email: "neue@email.com",
                    password: "password"
                }
            });
            expect(res.data.signup).toBeDefined();
        });
        /**
        it('login with correct credentials returns token-String', async () => {
            const res = await mutate({
                mutation: LOGIN,
                variables: {
                    email: "your@email.com",
                    password: "password"
                }
            });
            expect(res.data.login).toBeDefined();
        });
        **/

    });
});

const GET_ALL_USERS = gql `
                         query {
                              allUsers {
                                  id
                                  name
                                }
                              }
                            `;


const SIGNUP = gql `
                mutation signup($name: String!, $email: String!, $password:String!){
                   signup(name: $name , email:$email, password: $password)

                  }
                `;



const LOGIN = gql `
      mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password)
      }
  `;

const USER_BY_ID = gql `
                      query  userById($id:String!){
                        userById(id:$id) {
                          email
                        }
                      }
                    `;