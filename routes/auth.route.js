const express = require("express");
const asyncHandler = require("express-async-handler");
const authController = require("../controllers/auth.controller");
const { validateLogin } = require("../middleware/validation.middleware");

const articleRouter = express.Router();

// get list of articles
articleRouter.post("/login", validateLogin, asyncHandler(authController.login));

// get article content
articleRouter.post("/register", validateLogin, asyncHandler(authController.register));

module.exports = articleRouter;
