const { find }= require('lodash');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = "secret"

const users = [{
  id: 1,
  name: 'testuser',
  email: 'your@email.com',
  password: 'password'
}]

const userResolver = {
  Query: {
    allUsers: () => users,
  },
  Mutation: {
    login: async (_, {email, password}) => {
      const userFromEmail = find(users, {email: email});
      if (!userFromEmail) {
        throw new Error(`Couldn’t find a user with the email: ${email}`);
      }
      //const valid = await bcrypt.compare(password, userFromEmail.password);
      const valid = password == userFromEmail.password;
      if (!valid) {
        throw new Error('Incorrect password');
      }
      const token = jwt.sign({id: userFromEmail.id, email: userFromEmail.email}, SECRET, {expiresIn: '1y'});
      return token;
    }
  }
};

module.exports.userResolver = userResolver;
