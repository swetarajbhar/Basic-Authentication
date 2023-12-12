const express = require("express");
const router = express.Router();

const {
  UserRegistartionLoginSchema,
} = require("../../../global/validations/schema");
const { authenticate } = require("../../../global/middleware/index");
const { validate } = require("../../../global/validations/validator");
const {
  userRegistration,
  userLogin,
  refreshAccessToken,
  accessProtectedResource,
  listUsers,
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

// Protected Resource Endpoint
router.get("/protected", authenticate, accessProtectedResource);

// List Users Endpoint
router.get("/users", authenticate, listUsers);

module.exports = router;
