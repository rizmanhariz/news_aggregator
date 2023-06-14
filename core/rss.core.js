const parseISO = require("date-fns/parseISO");
const Parser = require("rss-parser");
const logger = require("./log.core");
const { PublisherModel } = require("../models/publisher.model");
const { ArticleModel } = require("../models/article.model");

async function getRSSData(publisher) {
  try {
    const parser = new Parser();
    const feedData = await parser.parseURL(publisher.rss_url);
    return feedData;
  } catch (err) {
    // error getting feed. update status for a retry
    logger.error("PARSER ERROR", err);
    await PublisherModel.updateOne(
      { _id: publisher._id },
      { $inc: { retryAttempt: 1 } },
    );
    return [];
  }
}

async function saveRSSData(publisher, rssItems) {
  const promiseArray = rssItems.map(async (item) => ArticleModel.findOneAndUpdate(
    {
      publisher: publisher._id,
      guid: item.guid,
    },
    {
      title: item.title,
      url: item.link,
      description: item.contentSnippet,
      publisher: publisher._id,
      guid: item.guid,
      language: publisher.language,
      publishedAt: parseISO(item.isoDate),
      content: item["content:encoded"],
    },
    { upsert: true },
  ));
  await Promise.allSettled(promiseArray);
}

module.exports = {
  getRSSData,
  saveRSSData,
};
