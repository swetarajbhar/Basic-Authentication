const { refreshAccessTokenService } = require("../../../src/v1/service/index");

const { verifyJWTToken } = require("../../utility/jwt");

// Middleware for authenticating requests using JWT
const authenticate = async (req, res, next) => {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.cookies["refreshToken"];

  if (accessToken) {
    const tokenParts = accessToken.split(" ");
    if (
      tokenParts.length === 2 &&
      tokenParts[0] === "Bearer" &&
      tokenParts[1]
    ) {
      try {
        const decoded = verifyJWTToken(
          tokenParts[1],
          process.env.JWT_ACCESS_TOKEN_SECRET
        );
        req.user = decoded.payload;
        return next();
      } catch (error) {
        if (!refreshToken) {
          return res.status(401).send({
            status: 401,
            message: "Access Denied. No refresh token provided.",
          });
        }

        const { accessToken } = await refreshAccessTokenService(refreshToken);

        if (accessToken) {
          res.header("Authorization", `Bearer ${accessToken}`);
          return next();
        }
        return res.status(400).send({ status: 400, message: "Invalid Token." });
      }
    }
  }

  return res
    .status(401)
    .send({ status: 401, message: "Access Denied. No token provided." });
};

module.exports = {
  authenticate,
};
