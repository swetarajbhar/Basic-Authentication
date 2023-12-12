const { createRespHeader } = require("../../../utility/createResponseHeader");
const { message } = require("../../../utility/message_code");
const {
  userRegistrationService,
  userLoginService,
  refreshAccessTokenService,
  listUsersService,
} = require("../../service/index");

// Function to handle user registration
const userRegistration = async (req, res, next) => {
  try {
    res.body = createRespHeader();
    const { username, password } = req.body;
    const response = await userRegistrationService({ username, password });
    const responseReceived = response ? 200 : 400;
    res.body.data = response;
    res.body.message = message.register[responseReceived];
    res.status(responseReceived).send({
      status: responseReceived,
      ...res.body,
    });
  } catch (error) {
    const errorReceived = error.message === "409" ? 409 : 500;
    res.status(errorReceived).send({
      status: errorReceived,
      message: message.register[errorReceived],
    });
  }
};

// Function to handle user login
const userLogin = async (req, res, next) => {
  try {
    res.body = createRespHeader();
    const { username, password } = req.body;
    const response = await userLoginService({ username, password });

    // Extract accessToken and refreshToken from the response
    const refreshToken = response?.refreshToken;
    const accessToken = response?.accessToken;

    // Set refreshToken in a cookie if present
    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
    }

    // Set accessToken in the response header if present
    if (accessToken) {
      res.header("Authorization", `Bearer ${accessToken}`);
    }
    res.body.data = {
      accessToken: response?.accessToken,
    };

    const responseReceived = response ? 200 : 401;

    res.body.message = message.login[responseReceived];
    res.status(responseReceived).send({
      status: responseReceived,
      ...res.body,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: message.login[500],
    });
  }
};

// Function to handle refreshing access tokens
const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      // If no refresh token is provided, send an access denied response
      return res.status(401).send({
        status: 401,
        message: "Access Denied. No refresh token provided.",
      });
    }

    const response = await refreshAccessTokenService(refreshToken);
    if (response) {
      res.header("Authorization", `Bearer ${response.accessToken}`);
    }

    const responseReceived = response ? 200 : 401;
    res.status(responseReceived).send({
      status: responseReceived,
      message: response ? "Access Token Generated" : "Invalid refresh token.",
      data: response,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error,
    });
  }
};

// Function to handle access to a protected resource
const accessProtectedResource = async (req, res, next) => {
  try {
    res.status(200).send({
      message: "You've accessed the protected resource!",
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error,
    });
  }
};

// Function to list users
const listUsers = async (req, res, next) => {
  try {
    res.body = createRespHeader();
    const response = await listUsersService();
    const responseReceived = response ? 200 : 404;

    res.body.data = response;
    res.body.message = message.find[responseReceived];
    res.status(responseReceived).send({
      status: responseReceived,
      ...res.body,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error,
    });
  }
};

module.exports = {
  userRegistration,
  userLogin,
  refreshAccessToken,
  accessProtectedResource,
  listUsers,
};
