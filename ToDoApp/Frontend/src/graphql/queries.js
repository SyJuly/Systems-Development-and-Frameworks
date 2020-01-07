import gql from 'graphql-tag'

export const LOGIN = gql`
        mutation login($email: String!, $password:String!) {
            login(email: $email, password: $password)
        }
    `;
export const GET_ALL_TODOS = gql `
                         query {
                              allTodos {
                                  id
                                  message
                                }
                              }
                            `;
export const GET_ALL_EVENTS = gql `
                         query {
                              allEvents {
                                  id
                                  motto
                                  date
                                }
                              }
                            `;
