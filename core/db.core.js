const mongoose = require("mongoose");

// set up db connection
async function connectMongoDB() {
  mongoose.connect(process.env.MONGO_CONNECTION_STRING);
}

module.exports = {
  connectMongoDB,
};
