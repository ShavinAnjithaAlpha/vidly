const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  // connect to the database
  mongoose.connect("mongodb://127.0.0.1/vidly").then(() => {
    winston.info("Connected to MongoDB...");
  });
};
