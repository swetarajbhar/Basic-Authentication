const jwt = require("jsonwebtoken");

const generateJWTToken = (tokenParams) => {
  return jwt.sign({ payload: tokenParams.username }, tokenParams.secret, {
    expiresIn: tokenParams.expiry,
  });
};

const verifyJWTToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};
module.exports = {
  generateJWTToken,
  verifyJWTToken,
};
