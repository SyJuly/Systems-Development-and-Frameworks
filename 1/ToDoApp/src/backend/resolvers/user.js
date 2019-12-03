const { find }= require('lodash');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = "secret"

const users = [{
  id: 1,
  name: 'testuser',
  email: 'your@email.com',
  password: '$2y$10$3IUx11G0mcJfSpFWn3Lru.xac9OqHDzqLOAhdZovaUyKa2DhgCaOS' // "password"
}]

var currentID = 1;

const userResolver = {
  Query: {
    allUsers: () => users,
  },
  Mutation: {
    signup: (_, {name, email, password}) => {
      users.push({
        id: currentID + 1,
        name: name,
        email: email,
        password: bcrypt.hash(password, 10),
      });
      currentID++;
      const token = jwt.sign({id: currentID + 1, email: email}, SECRET, {expiresIn: '1y'});
      return token;
    },
    login: (_, {email, password}) => {
      const userFromEmail = find(users, {email: email});
      if (!userFromEmail) {
        throw new Error(`Couldn’t find a user with the email: ${email}`);
      }
      const valid = bcrypt.compare(password, userFromEmail.password);
      //const valid = password == userFromEmail.password;
      if (!valid) {
        throw new Error('Incorrect password');
      }
      const token = jwt.sign({id: userFromEmail.id, email: userFromEmail.email}, SECRET, {expiresIn: '1y'});
      return token;
    }
  }
};

module.exports.userResolver = userResolver;
