const { ObjectId } = require("mongoose").Types;
const { PublisherModel } = require("../models/publisher.model");
const { getMongoPagination } = require("../helpers/query.helper");
const { AppError } = require("../core/error.core");

async function getPublishers(req, res) {
  const { name } = req.query;
  const queryFilter = { };
  if (name) {
    queryFilter.name = { $regex: name, $options: "i" };
  }

  let projection = {};

  if (!req.user?.isAdmin) {
    projection = { name: 1, url: 1, defaultImage: 1 };
    queryFilter.isActive = true;
  }

  const publisherData = await PublisherModel.find(
    queryFilter,
    projection,
    {
      ...getMongoPagination(req.query),
    },
  );
  res.send(publisherData);
}

async function getOnePublisher(req, res) {
  const publisherData = await PublisherModel.findById(req.params.id);
  res.send(publisherData);
}

async function createPublisher(req, res) {
  const newPublisher = new PublisherModel({
    ...req.body,
  });
  await newPublisher.save();
  res.send({ id: newPublisher._id });
}

async function updatePublisher(req, res) {
  const updatedPublisher = await PublisherModel.findOneAndUpdate(
    {
      _id: new ObjectId(req.params.id),
    },
    req.body,
    { new: true },
  );

  if (!updatedPublisher) {
    throw new AppError(404, "INPUT002", true, "PUBLISHER NOT FOUND");
  }

  res.send(updatedPublisher);
}

module.exports = {
  getPublishers,
  getOnePublisher,
  createPublisher,
  updatePublisher,
};
