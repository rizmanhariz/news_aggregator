const logger = require("../core/log.core");
const { PublisherModel } = require("../models/publisher.model");
const { getRSSData, saveRSSData } = require("../core/rss.core");

async function scrapePublishers() {
  logger.info("scrapePublishers", "starting");
  // get all active publishers
  const publisherData = await PublisherModel.find({ isActive: true }, {});
  const promiseArray = publisherData.map(async (publisher) => {
    const rssData = await getRSSData(publisher);
    await saveRSSData(publisher, rssData.items);
  });
  await Promise.allSettled(promiseArray);
}

module.exports = {
  scrapePublishers,
};
