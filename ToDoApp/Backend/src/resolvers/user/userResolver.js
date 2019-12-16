const { find }= require('lodash');
const { generateIntID }= require("../../../utils.js");
const { CONFIG }= require("../../config/config");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { neo4jgraphql } = require('neo4j-graphql-js');


const userResolver = {
  Query: {
    //allUsers: () => users,
    allUsers(object, params, context, resolveInfo) {
      return neo4jgraphql(object, params, context, resolveInfo);
    }
  },
  Mutation: {
    signup: (_, {name, email, password}) => {
      const userID = generateIntID()
      const userFromEmail = find(users, {email: email});
      if (userFromEmail) {
        throw new Error(`This email is already used by another user: ${email}`);
      }
      users.push({
        id: userID,
        name: name,
        email: email,
        password: bcrypt.hash(password, 10),
      });
      const token = jwt.sign({id: userID, email: email}, CONFIG.JWT_SECRET, {expiresIn: '1y'});
      return token;
    },
    login: (_, {email, password}) => {
      const userFromEmail = find(users, {email: email});
      if (!userFromEmail) {
        throw new Error(`Couldn’t find a user with the email: ${email}`);
      }
      const valid = bcrypt.compare(password, userFromEmail.password);
      if (!valid) {
        throw new Error('Incorrect password');
      }
      const token = jwt.sign({id: userFromEmail.id, email: userFromEmail.email}, CONFIG.JWT_SECRET, {expiresIn: '1y'});
      return token;
    }
  }
};

module.exports.userResolver = userResolver;
