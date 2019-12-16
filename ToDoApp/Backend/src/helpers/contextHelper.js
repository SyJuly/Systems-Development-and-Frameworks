const jwt = require('jsonwebtoken')

const getContext = (req) => {
  if (context) {
    return context;
  }

  const token = req.headers.authorization || "";
  const decodedToken = jwt.verify(token, CONFIG.JWT_SECRET)
  if (decodedToken) {
    return {
      token: token,
      user: decodedToken,
    }
  }
}

module.exports.getContext = getContext;