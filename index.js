const express = require("express");
const winston = require("winston");

const app = express();
require("./start/validation")(); // create the validation
require("./start/routes")(app); // create the routes
require("./start/db")(); // create the mongo database connection
require("./start/logging")(); // create the logger
require("./start/config")(); // create the config

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});
