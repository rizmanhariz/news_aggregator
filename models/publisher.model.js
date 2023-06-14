const { Schema, model } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const STATUS_ENUM = {
  ACTIVE: "ACTIVE",
  ERROR: "ERROR",
};

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
    retryAttempt: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      default: STATUS_ENUM.ACTIVE,
      enum: Object.values(STATUS_ENUM),
    },
  },
  { timestamps: true },
);

publisherSchema.plugin(mongoosePaginate);

const PublisherModel = model("publisher", publisherSchema);

module.exports = {
  PublisherModel,
};
