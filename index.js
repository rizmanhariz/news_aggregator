const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cron = require("node-cron");
const { sendErrorResponse } = require("./core/error.core");
const { connectMongoDB } = require("./core/db.core");
const { scrapePublishers } = require("./jobs/rss.jobs");
const logger = require("./core/log.core");

// define routers
const authRouter = require("./routes/auth.route");
const publisherRouter = require("./routes/publisher.route");
const articleRouter = require("./routes/article.route");

// get env variables
require("dotenv").config();

const PORT = process.env.PORT || 9000;
const app = express();
connectMongoDB();

// set up mongo connection

// handle cors & general security
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/publisher", publisherRouter);
app.use("/article", articleRouter);

app.get("/", (req, res) => {
  res.send("Hey there");
});

app.use(sendErrorResponse);

app.listen(PORT);
logger.info(`Server live on PORT: ${PORT}`);

// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *
cron.schedule("0 0 * * * *", () => {
  // runs hourly to scrape apis
  try {
    await scrapePublishers();
  } catch (err) {
    logger.error("CRON-SCRAPE", err);
  }
});
