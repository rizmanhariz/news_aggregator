const { ArticleModel } = require("../models/article.model");

async function getArticles(req, res) {
  res.send("SUCCESS");
}
async function getSingleArticle(req, res) {
  res.send("SUCCESS");
}

module.exports = {
  getArticles,
  getSingleArticle,
};
