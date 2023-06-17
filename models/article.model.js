const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { ObjectId } = Schema.Types;
require("./publisher.model");

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    guid: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    publisher: {
      type: ObjectId,
      required: true,
      ref: "publisher",
    },
    description: {
      type: String,
    },
    content: {
      type: String,
    },
    publishedAt: {
      type: Date,
      required: false,
    },
    language: {
      type: String,
    },
  },
  { timestamps: true },
);
articleSchema.plugin(mongoosePaginate);
articleSchema.index({ publisher: 1, guid: 1 }, { unique: true });

const ArticleModel = model("article", articleSchema);

module.exports = {
  ArticleModel,
};
