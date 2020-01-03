const {AuthenticationError} = require("apollo-server-errors");
const jwt = require('jsonwebtoken')
const { CONFIG }= require("../config/config");

const getAuth = (req) => {
  const authToken = req.get('auth-token');
  if(authToken == null){
    return {};
  }
  return getContextAuthorizationObject(authToken);
}

const getToken = (userID, email) => {
  return jwt.sign({
    id: userID,
    email: email
  }, CONFIG.JWT_SECRET, {
    expiresIn: '1y'
  });
}

const getContextAuthorizationObject = (authToken) => {
  const decoded = jwt.verify(authToken, CONFIG.JWT_SECRET)
  return({
    token: authToken,
    userId: decoded.id,
  })
}

module.exports.getToken = getToken;
module.exports.getAuth = getAuth;