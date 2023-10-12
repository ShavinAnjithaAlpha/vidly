const winston = require("winston");

module.exports = function (err, req, res, next) {
  // log the error
  winston.error(err.message, err);
  // send the response about the error to the client
  res.status(500).send("Something failed.");
};
