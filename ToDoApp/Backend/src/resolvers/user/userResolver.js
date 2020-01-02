const { find } = require('lodash');
const { generateUUID } = require("../../../utils.js");
const { CONFIG } = require("../../config/config");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { neo4jgraphql } = require('neo4j-graphql-js');
const { users } = require('../../db/data')
const { getToken } = require('../../utils/auth')


const userResolver = {
    Query: {
        allUsers: async (parent, args, context) => {
            const session = context.driver.session();
            const queryResults = await session.run('MATCH(u:User)RETURN u ORDER BY u.name ASC ');
            const users = queryResults.records.map(user => user.get(`u`).properties);
            session.close()
            return users;
        },
        userById: async (root, {
            id
        }, context) => {
            const session = context.driver.session();
            const queryResults = await session.run('MATCH(u:User) WHERE u.id = $id RETURN u', {
                id: id
            });
            session.close();
            return queryResults.records[0].get("u").properties;

        },
    },
    Mutation: {
        signup: async (_, {
            name,
            email,
            password
        }, context) => {
            const userID = generateUUID();
            const session = context.driver.session();
            const queryResults = await session.run(
                'MATCH (u:User {email:$email}) RETURN u', {
                    email
                }
            );
            const userFromEmail = queryResults.records.map(user => user.get(`u`).properties)[0];
            if (userFromEmail != null) {
                throw new Error(`This email is already used by another user: ${email}`);
            } else {
                await session.run(
                    'CREATE (u:User {id: $id, name: $name,email: $email ,password: $password }) RETURN u', {
                        id: userID,
                        name: name,
                        email: email,
                        password: bcrypt.hash(password, 10).toString()
                    }
                );
            }
            session.close();
            return getToken(userID, email);
        },
        login: async (_, {
            email,
            password
        }, context) => {
            const session = context.driver.session();
            const queryResults = await session.run(
                'MATCH (u:User {email:$email}) RETURN u', {
                    email
                }
            );
            const userFromEmail = queryResults.records.map(user => user.get(`u`).properties)[0];
            if (userFromEmail == null) {
                throw new Error(`Couldn’t find a user for email: ${email}`);
            }
            const valid = bcrypt.compare(password, userFromEmail.password);
            if (!valid) {
                throw new Error('Incorrect password');
            }
            session.close();
            return getToken(userFromEmail.id, userFromEmail.email);
        }
    }
}
module.exports.userResolver = userResolver;