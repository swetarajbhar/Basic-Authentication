const message = {
  register: {
    200: "Registartion Successful",
    400: "Bad request",
    401: "Unauthorised",
    403: "Forbidden",
    404: "User not found.",
    409: "Username already exists. Choose a different username.",
    500: "Internal server error",
  },
  login: {
    200: "Login Successful",
    400: "Bad request",
    401: "Unauthorised",
    403: "Forbidden",
    404: "User not found.",
    409: "Resource Conflict",
    500: "Internal server error",
  },
  find: {
    200: "User Data Fetched Successfully",
    400: "Bad request",
    401: "Unauthorised",
    403: "Forbidden",
    404: "User not found.",
    409: "Resource Conflict",
    500: "Internal server error",
  },
};

module.exports = { message };
