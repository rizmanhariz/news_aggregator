const express = require("express");
const asyncHandler = require("express-async-handler");
const articleController = require("../controllers/article.controller");
const { validateGetArticles } = require("../middleware/validation.middleware");

const articleRouter = express.Router();

// get list of articles
articleRouter.get(
  "/",
  validateGetArticles,
  asyncHandler(articleController.getArticles),
);

// get article content
articleRouter.get("/:id", asyncHandler(articleController.getSingleArticle));

module.exports = articleRouter;
