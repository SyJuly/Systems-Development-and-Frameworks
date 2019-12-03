const { find }= require('lodash');
const { generateIntID }= require("../utils.js");
const { CONFIG }= require("../config/config");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const users = [{
  id: 1,
  name: 'testuser',
  email: 'your@email.com',
  password: '$2y$10$3IUx11G0mcJfSpFWn3Lru.xac9OqHDzqLOAhdZovaUyKa2DhgCaOS' // "password"
}]

const userResolver = {
  Query: {
    allUsers: () => users,
  },
  Mutation: {
    signup: (_, {name, email, password}) => {
      const userID = generateIntID()
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
