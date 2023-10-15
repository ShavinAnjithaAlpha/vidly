const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  // connect to the database
  mongoose.connect(config.get("db")).then(() => {
    winston.info(`Connected to MongoDB: <<<${config.get("db")}>>>`);
  });
};
