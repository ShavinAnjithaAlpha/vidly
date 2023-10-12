const mongoose = require("mongoose");
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genres");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// implement the API end points for the movie model
router.get("/", async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const movies = await Movie.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({
        title: 1,
        genre: 1,
        numberInStock: 1,
        dailyRentalRate: 1,
      });

    res.send(movies);
  } catch (err) {
    res.status(500).send("Internal Server Error.");
  }
});

router.post("/", auth, async (req, res) => {
  // validate the request body
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // first find the genre object according to given genreId

  try {
    const genresPromises = [];
    for (const genreId of req.body.genreIds) {
      genresPromises.push(Genre.findById(genreId));
    }

    const genres = await Promise.all(genresPromises);

    if (genres.length !== req.body.genreIds.length)
      return res.status(400).send("Invalid Genre.");

    // create a genres object to be saved in the movie object
    const genresObject = genres.map((genre) => {
      return {
        _id: genre._id,
        name: genre.name,
      };
    });

    // create a new movie object
    const movie = new Movie({
      title: req.body.title,
      genres: genresObject,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    console.log(movie);
    const result = await movie.save();
    res.send(result);
  } catch (err) {
    res.status(500).send(`Internal Server Error. ${err}`);
  }
});

router.put("/:id", async (req, res) => {
  // first validate the request body
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // find the genre object according to the given genreIds
    const genresPromises = [];
    for (const genreId of req.body.genreIds) {
      genresPromises.push(Genre.findById(genreId));
    }

    const genres = await Promise.all(genresPromises);

    if (genres.length !== req.body.genreIds.length)
      return res.status(400).send("Invalid Genre.");

    // create a genres object to be saved in the movie object
    const genresObject = genres.map((genre) => {
      return {
        _id: genre._id,
        name: genre.name,
      };
    });

    // find the movie object and update it
    const movie = await Movie.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          genres: genresObject,
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate,
        },
      },
      { new: true }
    );

    res.send(movie);
  } catch (err) {
    res.status(500).send("Internal Server Error.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");

    return res.send(movie);
  } catch (err) {
    res.status(500).send("Invalid ID.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found.");

    return res.send(movie);
  } catch (err) {
    res.status(400).send("Invalid ID.");
  }
});

module.exports = router;
