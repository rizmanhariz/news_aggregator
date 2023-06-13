const express = require("express");
const { checkIsAdmin } = require("../middleware/auth.middleware");
const publisherController = require("../controllers/publisher.controller");

const publisherRouter = express.Router();

publisherRouter.get("/", publisherController.getPublicPublishers);

// admin only endpoints
publisherRouter.use(checkIsAdmin);
publisherRouter.post("/", publisherController.createPublisher);
publisherRouter.post("/update", publisherController.updatePublisher);

module.exports = publisherRouter;
