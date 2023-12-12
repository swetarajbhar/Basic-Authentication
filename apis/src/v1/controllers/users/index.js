const { createRespHeader } = require("../../../utility/createResponseHeader");
const { message } = require("../../../utility/message_code");
const {
  userRegistrationService,
  userLoginService,
  refreshAccessTokenService,
} = require("../../service/index");

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

const userLogin = async (req, res, next) => {
  try {
    res.body = createRespHeader();
    const { username, password } = req.body;
    const response = await userLoginService({ username, password });

    const refreshToken = response?.refreshToken;
    if (refreshToken) {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });
    }
    res.body.data = {
      accessToken: response?.accessToken,
    };

    const responseReceived = response ? 200 : 404;

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

const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      return res.status(401).send({
        status: 401,
        message: "Access Denied. No refresh token provided.",
      });
    }

    const response = await refreshAccessTokenService(refreshToken);

    const responseReceived = response ? 200 : 400;
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
module.exports = {
  userRegistration,
  userLogin,
  refreshAccessToken,
};
