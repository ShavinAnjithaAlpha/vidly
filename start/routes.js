const express = require("express");
const genresRouter = require("../routes/genres.routes");
const cussomerRouter = require("../routes/customer.routes");
const movieRouter = require("../routes/movie.routes");
const rentalRouter = require("../routes/rental.routes");
const userRouter = require("../routes/user.routes");
const authRouter = require("../routes/auth.routes");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/genres", genresRouter);
  app.use("/api/customer", cussomerRouter);
  app.use("/api/movie", movieRouter);
  app.use("/api/rental", rentalRouter);
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);
  app.use(error);
};
