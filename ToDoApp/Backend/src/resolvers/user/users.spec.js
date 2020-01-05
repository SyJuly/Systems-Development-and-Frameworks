const { createTestClient } = require('apollo-server-testing');
const { gql} = require('apollo-server');
const { getTestApolloServer,cleanDatabase,createUser } = require('../../utils/testHelper');


const {query, mutate} = createTestClient(getTestApolloServer(true));

afterEach(async (done) => {
    await cleanDatabase()
    done()
})

describe('User', () => {
 beforeEach(async () => {
           await createUser ({id:"11",name: 'X Testuser', email: 'xtester@email.com' , password:'password'})
        })
        describe('query', () =>{
            it('by Email', async () => {
                const res = await query({
                    query: USER_BY_EMAIL,
                    variables: {
                        email: "xtester@email.com"
                    }
                });
                expect(res.data.userByEmail.name).toEqual("X Testuser");
            });
            it('orders List by Name ASC ', async () => {
                await createUser ({id:"99",name: 'A Testuser', email: 'atester@email.com' ,password:'password'})
                const res = await query({
                    query: GET_ALL_USERS
                });
                expect(res.data.allUsers[0].name).toEqual("A Testuser");
            });
        });
         describe('mutate', () => {
                it('signup returns error when email is already in use', async () => {
                    const res = await mutate({
                        mutation: SIGNUP,
                        variables: {
                            name: "eva",
                            email: "xtester@email.com",
                            password: "password"
                        }
                    });
                    expect(res.errors).toHaveLength(1);
                    expect(res.data).tobeNull;
                });
                it('signup returns token-String when email is not already in use', async () => {
                    const res = await mutate({
                        mutation: SIGNUP,
                        variables: {
                            name: "eva",
                            email: "eva@email.com",
                            password: "password"
                        }
                    });
                    expect(res.data.signup).toBeDefined();
                });

                const {query, mutate} = createTestClient(getTestApolloServer(false));
                it('login with correct credentials returns token-String', async () => {
                    const res = await mutate({
                        mutation: LOGIN,
                        variables: {
                            email: "xtester@email.com",
                            password: "password"
                        }
                    });
                    expect(res.data.login).toBeDefined();
                });
            });
});

const GET_ALL_USERS = gql `
                         query {
                              allUsers {
                                  id,
                                  name,
                                  email
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

const USER_BY_EMAIL = gql `
                      query userByEmail($email:String!){
                        userByEmail(email:$email) {
                          email,
                          name
                        }
                      }
                    `;