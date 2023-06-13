const { Schema, model } = require("mongoose");

const publisherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    defaultImage: {
      type: String,
      required: false,
    },
    rss_url: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const PublisherModel = model("publisher", publisherSchema);

module.exports = {
  PublisherModel,
};
