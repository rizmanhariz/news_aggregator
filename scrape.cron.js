/** This file is to be run by a cronjob - OR run manually */
const { scrapePublishers } = require("./jobs/rss.jobs");
const { connectMongoDB } = require("./core/db.core");
require("dotenv").config();

async function init() {
  console.log("starting script");
  await connectMongoDB();
  console.log("connected to db");
  await scrapePublishers();
  console.log("completed scrape");
}

init();
