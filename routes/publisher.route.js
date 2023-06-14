const express = require("express");
const asyncHandler = require("express-async-handler");
const { authenticateUser, checkIsAdmin } = require("../middleware/auth.middleware");
const validationMiddleware = require("../middleware/validation.middleware");
const publisherController = require("../controllers/publisher.controller");

const publisherRouter = express.Router();

publisherRouter.get(
  "/",
  validationMiddleware.validateGetPublishers,
  asyncHandler(publisherController.getPublishers),
);

// admin only endpoints
publisherRouter.use(authenticateUser);
publisherRouter.use(checkIsAdmin);
publisherRouter.get(
  "/:id",
  asyncHandler(publisherController.getOnePublisher),
);
publisherRouter.post(
  "/",
  validationMiddleware.validateCreatePublisher,
  asyncHandler(publisherController.createPublisher),
);
publisherRouter.put(
  "/:id",
  validationMiddleware.validateCreatePublisher,
  asyncHandler(publisherController.updatePublisher),
);

module.exports = publisherRouter;
