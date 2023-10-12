const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://127.0.0.1/vidly",
      level: "error",
    })
  );
  // // log the unhandled exceptions to a log file
  // winston.handleExceptions(
  //   new winston.transports.File({ filename: "uncaughtExceptions.log" })
  // );

  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );
  // event handler for unhandled promise rejections
  process.on("unhandledRejection", (ex) => {
    // console.log("WE GOT AN UNHANDLED REJECTION");
    // winston.error(ex.message, ex);
    // process.exit(1);
    throw ex;
  });
};
