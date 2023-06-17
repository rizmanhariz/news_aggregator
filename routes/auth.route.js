const express = require("express");
const asyncHandler = require("express-async-handler");
const authController = require("../controllers/auth.controller");
const { validateLogin } = require("../middleware/validation.middleware");
const { authenticateUser, checkUserLoggedIn } = require("../middleware/auth.middleware");

const authRouter = express.Router();

// get list of articles
authRouter.post("/login", validateLogin, asyncHandler(authController.login));

// get article content
authRouter.post(
  "/register",
  validateLogin,
  authenticateUser,
  checkUserLoggedIn,
  asyncHandler(authController.register),
);

module.exports = authRouter;
