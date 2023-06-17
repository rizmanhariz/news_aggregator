const { ObjectId } = require("mongoose").Types;
const { PublisherModel } = require("../models/publisher.model");
const { AppError } = require("../core/error.core");
const { getRSSData } = require("../core/rss.core");

async function getPublishers(req, res) {
  const { name, page, limit } = req.query;
  const queryFilter = {};
  if (name) {
    queryFilter.name = { $regex: name, $options: "i" };
  }

  let projection = {};

  if (!req.user?.isAdmin) {
    // generic user filters - skip deleted, only retrieve basic data
    projection = { name: 1, url: 1, defaultImage: 1 };
    queryFilter.isDeleted = false;
  }

  const publisherData = await PublisherModel.paginate(queryFilter, {
    page,
    limit,
    projection,
    sort: { createdAt: -1 },
  });
  res.send(publisherData);
}

async function getOnePublisher(req, res) {
  const publisherData = await PublisherModel.findById(req.params.id);
  res.send(publisherData);
}

async function createPublisher(req, res) {
  try {
    // validate if rss url works
    await getRSSData(req.body);
  } catch (err) {
    // rss doesnt work
    throw new AppError(400, "INPUT001", false, "UNABLE TO PULL DATA FROM RSS-URL");
  }
  const newPublisher = new PublisherModel({
    ...req.body,
  });
  await newPublisher.save();
  res.send({ id: newPublisher._id });
}

async function updatePublisher(req, res) {
  try {
    // validate if rss url works
    await getRSSData(req.body);
  } catch (err) {
    // rss doesnt work
    throw new AppError(400, "INPUT001", false, "UNABLE TO PULL DATA FROM RSS-URL");
  }
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
