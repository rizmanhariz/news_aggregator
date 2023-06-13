const { PublisherModel } = require("../models/publisher.model");

async function getPublicPublishers(req, res) {
  res.send("SUCCESS");
}
async function getAllPublishers(req, res) {
  res.send("SUCCESS");
}
async function createPublisher(req, res) {
  res.send("SUCCESS");
}
async function updatePublisher(req, res) {
  res.send("SUCCESS");
}

module.exports = {
  getPublicPublishers,
  getAllPublishers,
  createPublisher,
  updatePublisher,
};
