const { createRespHeader } = require("../../../utility/createResponseHeader");
const { message } = require("../../../utility/message_code");
const {
  userRegistrationService,
  userLoginService,
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
    const responseReceived = response ? 200 : 404;
    res.body.data = response;
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

module.exports = {
  userRegistration,
  userLogin,
};
