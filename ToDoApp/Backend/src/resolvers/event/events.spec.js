const { createTestClient } = require('apollo-server-testing');
const { gql} = require('apollo-server');
const { getTestApolloServer,cleanDatabase,createUser,createTodo,createEvent } = require('../../utils/testHelper');

const {query, mutate} = createTestClient(getTestApolloServer(true));

afterEach(async (done) => {
    await cleanDatabase()
    done()
})

describe('Events', () => {
    beforeEach(async () => {
        await createEvent({id: "1",motto: '90s Party',date: "31.01.2020"  })
        await createEvent({id: "2", motto: 'SDF Vortrag', date: "15.01.2020" })
    })
    it('adding event with same motto returns an Error', async () => {
        const res = await mutate({
            mutation: CREATE_EVENT,
            variables: {
                motto: "SDF Vortrag",
                date: "12.01.2020"
            }
        });
        expect(res.errors[0].message).toEqual("There is already an event with this motto");
    });

    it('adding a new event', async () => {
        const res = await mutate({
            mutation: CREATE_EVENT,
            variables: {
                motto: "Hochzeit",
                date: "12.01.2020"
            }
        });
        expect(res.data.addEvent).toMatchObject({
            motto: "Hochzeit",
            date: "12.01.2020"
        });
    });
    it('query event by motto', async () => {
        const res = await mutate({
            mutation: EVENT_BY_MOTTO,
            variables: {
                motto: "SDF Vortrag"
            }
        });
        expect(res.data.eventByMotto.motto).toEqual("SDF Vortrag");
    });
});

const GET_ALL_EVENTS = gql `
                         query {
                              allEvents {
                                  id
                                  motto
                                  date
                                }
                              }
                            `;




const CREATE_EVENT = gql `
                mutation addEvent($motto: String, $date: String){
                   addEvent(motto: $motto, date: $date)
                    {
                      motto,
                      date
                    }
                  }
                `;

const EVENT_BY_MOTTO = gql `
                        query eventByMotto($motto:String!){
                          eventByMotto(motto:$motto) {
                            motto,
                            date
                          }
                        }
                      `;