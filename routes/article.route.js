const express = require("express");
const articleController = require("../controllers/publisher.controller");

const articleRouter = express.Router();

// get list of articles
articleRouter.get("/", articleController.getArticles);

// get article content
articleRouter.get("/:id", articleController.getSingleArticle);

module.exports = articleRouter;
