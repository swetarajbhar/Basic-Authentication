const express = require("express");
const router = express.Router();

const {
  UserRegistartionLoginSchema,
} = require("../../../global/validations/schema");
const { validate } = require("../../../global/validations/validator");
const {
  userRegistration,
  userLogin,
  refreshAccessToken,
} = require("../../controllers/users/index");

// User Registration Endpoint
router.post(
  "/register",
  validate(UserRegistartionLoginSchema),
  userRegistration
);

// User Login Endpoint
router.post("/login", validate(UserRegistartionLoginSchema), userLogin);

// Refresh Access Token Endpoint
router.post("/refresh", refreshAccessToken);

module.exports = router;
