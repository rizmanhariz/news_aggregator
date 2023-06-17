const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { ObjectId } = Schema.Types;
require("./publisher.model");

function getS3PublicLink(s3Path) {
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Path}`;
}

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
    s3Path: {
      type: String,
      get: getS3PublicLink,
    },
  },
  { timestamps: true, toJSON: { getters: true } },
);
articleSchema.plugin(mongoosePaginate);
articleSchema.index({ publisher: 1, guid: 1 }, { unique: true });

const ArticleModel = model("article", articleSchema);

module.exports = {
  ArticleModel,
};
