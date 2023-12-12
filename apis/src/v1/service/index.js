const bcrypt = require("bcrypt");
const { generateJWTToken, verifyJWTToken } = require("../../utility/jwt/index");

// Cost factor for bcrypt hashing
const salt = 10;

// In-memory data store for users
const users = [];

// Service function for user registration
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

// Service function for user login
const userLoginService = async (params) => {
  try {
    const user = users.find((u) => u.username === params.username);

    // Check if the user exists and the password is correct
    if (!user || !bcrypt.compareSync(params.password, user.password)) {
      return null;
    }

    // Generate access token and refresh token for successful login
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

// Service function for refreshing access tokens
const refreshAccessTokenService = async (refreshToken) => {
  try {
    let decoded;
    try {
      decoded = verifyJWTToken(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );
      const accessToken = generateJWTToken({
        username: decoded.payload,
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiry: process.env.JWT_ACCESS_TOKEN_EXPIRY,
      });
      return { accessToken };
    } catch (error) {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Service function for listing users
const listUsersService = async () => {
  try {
    return { users };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  userRegistrationService,
  userLoginService,
  refreshAccessTokenService,
  listUsersService,
};
