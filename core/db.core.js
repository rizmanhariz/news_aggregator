const mongoose = require("mongoose");

/** Sets up db connection */
async function connectMongoDB() {
  mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    // only set up indexes if not production
    autoIndex: process.env.ENV !== "production",
  });
}

module.exports = {
  connectMongoDB,
};
