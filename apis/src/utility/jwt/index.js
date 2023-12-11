const jwt = require("jsonwebtoken");

const generateJWTToken = (tokenParams) => {
  return jwt.sign({ payload: tokenParams.username }, tokenParams.secret, {
    expiresIn: tokenParams.expiry,
  });
};

module.exports = {
  generateJWTToken,
};
