const bcrypt = require("bcrypt");
const { generateJWTToken } = require("../../utility/jwt/index");

const salt = 10;

// In-memory data store for users
const users = [];

const userRegistrationService = async (params) => {
  try {
    // Check if the username already exists
    const existingUser = users.find((u) => u.username === params.username);
    if (existingUser) {
      throw new Error("409");
    }

    // If username doesn't exist, proceed with registration
    const hashedPassword = bcrypt.hashSync(params.password, salt);
    users.push({ username: params.username, password: hashedPassword });

    return true;
  } catch (error) {
    throw error;
  }
};

const userLoginService = async (params) => {
  try {
    const user = users.find((u) => u.username === params.username);

    if (!user || !bcrypt.compareSync(params.password, user.password)) {
      return null;
    }

    const accessToken = generateJWTToken({
      username: params.username,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = generateJWTToken({
      username: params.username,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiry: process.env.JWT_REFRESH_TOKEN_EXPIRY,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  userRegistrationService,
  userLoginService,
};
