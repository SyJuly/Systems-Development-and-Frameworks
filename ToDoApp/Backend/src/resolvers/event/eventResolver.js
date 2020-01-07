const { find } = require('lodash');
const { generateUUID } = require("../../../utils.js");
const { CONFIG } = require("../../config/config");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { neo4jgraphql } = require('neo4j-graphql-js');
const { getToken } = require('../../utils/auth')

const eventResolver = {
    Query: {
        allEvents: async (parent, args, context) => {
            const session = context.driver.session();
            const queryResults = await session.run('MATCH(e:Event)RETURN e ');
            const events = queryResults.records.map(event => event.get(`e`).properties);
            session.close()
            return events;
        },
        eventByMotto: async (root, {
            motto
        }, context) => {
            const session = context.driver.session();
            const queryResults = await session.run('MATCH(e:Event) WHERE e.motto = $motto RETURN e ', {
                motto:motto
            });
            session.close();
            return queryResults.records[0].get("e").properties;

        },
    },
    Mutation: {
        addEvent: async (_, {
            motto,
            date
        }, context) => {
            const event = {
                  id: generateUUID(),
                  motto: motto,
                  date: date
            }
            const session = context.driver.session();
            const queryResults = await session.run(
                'MATCH (e:Event {motto:$motto}) RETURN e', {
                    motto
                }
            );
            res = queryResults.records.map(event => event.get(`e`).properties)[0];
            if (res != null) {
                throw new Error(`There is already an event with this motto`);
            } else {
                await session.run(
                    'CREATE (e:Event {id: $id, motto: $motto, date: $date}) RETURN e',
                        {...event}
                )
            session.close();
            return event;
            }
        }
    }
}
module.exports.eventResolver = eventResolver;