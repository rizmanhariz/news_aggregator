const { ArticleModel } = require("../models/article.model");

async function getArticles(req, res) {
  const { page, limit = 10, lang } = req.query;
  const filter = {};
  const projection = {
    title: 1,
    url: 1,
    coverImage: 1,
    s3Path: 1,
    publishedAt: 1,
    language: 1,
  };

  if (lang) {
    filter.language = lang;
  }

  if (!req.user?.isAdmin) {
    filter.isDeleted = false;
  }
  const articleData = await ArticleModel.paginate(filter, {
    page,
    limit,
    projection,
    sort: { publishedAt: -1 },
    populate: {
      path: "publisher",
      select: "id name description published_at",
    },
  });
  res.send(articleData);
}
async function getSingleArticle(req, res) {
  let projection = {};
  if (!req.user?.isAdmin) {
    projection = {
      title: 1,
      url: 1,
      coverImage: 1,
      description: 1,
      content: 1,
      publishedAt: 1,
      language: 1,
      s3Path: 1,
    };
  }
  const articleData = await ArticleModel.findById(req.params.id, projection).populate("publisher", "name defaultImage");
  res.send(articleData);
}

module.exports = {
  getArticles,
  getSingleArticle,
};
