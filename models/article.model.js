const { Schema, model } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const { ObjectId } = Schema.Types;
require("./publisher.model");

const articleSchema = new Schema(
  {
    title: {
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
      required: true,
    },
  },
  { timestamps: true },
);
articleSchema.plugin(mongoosePaginate);

const ArticleModel = model("article", articleSchema);

module.exports = {
  ArticleModel,
};
