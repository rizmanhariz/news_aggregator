const { subDays, startOfDay } = require("date-fns");
const logger = require("../core/log.core");
const { PublisherModel, STATUS_ENUM } = require("../models/publisher.model");
const { ArticleModel } = require("../models/article.model");
const { getRSSData, saveRSSData } = require("../core/rss.core");
const { scrapeArticleWebpage } = require("../core/puppeteer.core");

async function scrapePublishers() {
  logger.info("scrapePublishers", "starting");
  // get all active publishers
  const publisherData = await PublisherModel.find({
    isDeleted: false,
    status: STATUS_ENUM.ACTIVE,
  });
  const promiseArray = publisherData.map(async (publisher) => {
    logger.info(publisher.name, "start");
    try {
      const rssData = await getRSSData(publisher);
      await saveRSSData(publisher, rssData.items);
      // mark
      await PublisherModel.findOneAndUpdate({
        _id: publisher._id,
      }, { retryAttempt: 0, status: STATUS_ENUM.ACTIVE });
    } catch (err) {
      logger.error(publisher.name, err);
      // increment error
      const updateParams = { $inc: { retryAttempt: 1 } };
      if ((publisher.retryAttempt + 1) >= process.env.RETRY_ATTEMPTS) {
        updateParams.status = STATUS_ENUM.ERROR;
      }
      logger.info(`${publisher.name} UPDATE`, updateParams);
      await PublisherModel.findOneAndUpdate({
        _id: publisher._id,
      }, updateParams);
      logger.info(publisher.name, "DUHN");
    }
  });
  await Promise.allSettled(promiseArray);
  logger.info("scrapePublishers", "RSS scrape completed");

  // get articles that dont have images
  const startingPoint = startOfDay(subDays(new Date(), process.env.PAST_DAYS)); // past ten days
  const articleData = await ArticleModel.find(
    {
      publishedAt: {
        $gte: startingPoint,
      },
      coverImage: {
        $exists: false,
      },
    },
    {
      url: 1,
      publisher: 1,
    },
    { limit: 3, sort: { publishedAt: -1 } },
  ).populate("publisher", "imageScraperMeta");

  // get their images
  // note, this COULD be changed to a more modern articleData.map and await Promise.all
  // need to validate if puppeteer can handle many open tabs concurrently
  // for demonstation sake - will run each sequentially
  for (const article of articleData) {
    if (article.publisher.imageScraperMeta) {
      const scrapedData = await scrapeArticleWebpage({
        targetUrl: article.url,
        toGetCoverImage: true,
        imageScraperOptions: article.publisher.imageScraperMeta,
        // optional - can also get text from website - possibly redundant with rss
        // toGetTextBody: true,
        // textScraperOption: article.publisher.textScraperMeta,
      });

      if (scrapedData) {
        await ArticleModel.findOneAndUpdate(
          { _id: article._id },
          {
            coverImage: scrapedData.url,
          },
        );
      }
    }
  }
}

module.exports = {
  scrapePublishers,
};
