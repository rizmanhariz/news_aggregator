const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true },
);

const UserModel = model("user", userSchema);

module.exports = {
  UserModel,
};
