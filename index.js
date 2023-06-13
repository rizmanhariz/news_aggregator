const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authMiddleware = require("./middleware/auth.middleware");
const { handleError } = require("./core/error.core");
const { connectMongoDB } = require("./core/db.core");
const logger = require("./core/log.core");

// define routers
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
app.use(authMiddleware.checkSecret);

app.use("/publisher", publisherRouter);
app.use("/article", articleRouter);

app.get("/", (req, res) => {
  res.send("Hey there");
});

app.use(handleError);

app.listen(PORT);
logger.info(`Server live on PORT: ${PORT}`);
