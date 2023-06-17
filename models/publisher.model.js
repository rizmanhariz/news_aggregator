const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const STATUS_ENUM = {
  ACTIVE: "ACTIVE",
  ERROR: "ERROR",
};

const LANG_ENUM = {
  en: "en",
  bm: "bm",
};

const imageScraperMetaSchema = new Schema({
  selector: {
    type: String,
  },
  attribute: {
    type: String,
  },
  postProcessingRegex: {
    type: String,
  },
});

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
    language: {
      type: String,
      required: true,
      enum: Object.values(LANG_ENUM),
    },
    defaultImage: {
      type: String,
      required: false,
    },
    rss_url: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    isDeleted: {
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
    imageScraperMeta: {
      type: imageScraperMetaSchema,
    },
  },
  { timestamps: true },
);

publisherSchema.plugin(mongoosePaginate);

const PublisherModel = model("publisher", publisherSchema);

module.exports = {
  PublisherModel,
  LANG_ENUM,
  STATUS_ENUM,
};
