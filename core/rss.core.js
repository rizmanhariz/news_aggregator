const parseISO = require("date-fns/parseISO");
const Parser = require("rss-parser");
const randomUserAgent = require("random-useragent");
const { ArticleModel } = require("../models/article.model");

/**
 * @typedef {object} rssResponse
 * @property {array} items
 */
/**
 * gets rssData from input url
 * @param {object} publisher
 * @param {string} publisher.rss_url - url for rss scraping
 * @returns {rssResponse}
 */
async function getRSSData(publisher) {
  const userAgent = randomUserAgent.getRandom((ua) => ua.browserName === "Chrome" && ua.osName === "Windows");
  const parser = new Parser({
    headers: { "User-Agent": userAgent },
  });
  const feedData = await parser.parseURL(publisher.rss_url);
  return feedData;
}

/**
 * @typedef {object} rssItems
 * @param {string} guid
 * @param {string} title
 * @param {string} contentSnippet
 * @param {string} link
 * @param {string} isoDate
 * @param {string} content:encoded
 */
/**
 * saves rssData into article
 * @param {object} publisher
 * @param {array<rssItems>} rssItems
 */
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
