const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("./logger");
const genresRouter = require("./routes/genres.routes");
const cussomerRouter = require("./routes/customer.routes");
const movieRouter = require("./routes/movie.routes");

// connect to the database
mongoose
  .connect("mongodb://127.0.0.1/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/api/genres", genresRouter);
app.use("/api/customer", cussomerRouter);
app.use("/api/movie", movieRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
