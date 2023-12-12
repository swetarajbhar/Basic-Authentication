const jwt = require("jsonwebtoken");

// Function to generate a JSON Web Token (JWT)
const generateJWTToken = (tokenParams) => {
  return jwt.sign({ payload: tokenParams.username }, tokenParams.secret, {
    expiresIn: tokenParams.expiry,
  });
};

// Function to verify a JSON Web Token (JWT) using a given secret key
const verifyJWTToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};
module.exports = {
  generateJWTToken,
  verifyJWTToken,
};
