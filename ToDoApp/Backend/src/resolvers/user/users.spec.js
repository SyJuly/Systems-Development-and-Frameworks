const { createTestClient } = require('apollo-server-testing');
const { gql} = require('apollo-server');
const { getTestApolloServer,cleanDatabase,createUser } = require('../../utils/testHelper');

const {query, mutate} = createTestClient(getTestApolloServer(false));


beforeEach(async () => {
             await cleanDatabase()
             await createUser ({name: 'x Testuser', email: 'xtester@email.com' , password:'password'})
             await createUser ({name: 'a Testuser', email: 'atester@email.com' ,password:'password'})
})
describe('User', () => {

        describe('query', () =>{
            it('by Email', async () => {
                const res = await query({
                    query: USER_BY_EMAIL,
                    variables: {
                        email: "atester@email.com"
                    }
                });
                expect(res.data.userByEmail.name).toEqual("a Testuser");
            });
            /**
            it('orders List by Name ', async () => {
                const res = await query({
                    query: GET_ALL_USERS
                });
                console.log(res.data)
                expect(res.data.allUsers[0].name).toEqual("a Testuser");
                expect(res.data.allUsers[1].name).toEqual("x Testuser");
            });
            **/
        });
         describe('mutate', () => {
                it('signup returns error when email is already in use', async () => {
                    const res = await mutate({
                        mutation: SIGNUP,
                        variables: {
                            name: "eva",
                            email: "atester@email.com",
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
                            email: "a@email.com",
                            password: "password"
                        }
                    });
                    expect(res.data.signup).toBeDefined();
                });

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