require("express-async-errors");
const express = require("express");
const router = express.Router();
const { Genre, validateGenre } = require("../models/genres");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

/**
 * Returns all genres.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get("/", async (req, res) => {
  // fetch the page size and page number from the query string
  const pageSize = parseInt(req.query.pageSize) || 10;
  const pageNumber = parseInt(req.query.pageNumber) || 1;

  // fetch the genres from the database
  const genres = await Genre.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1, description: 1 });

  res.send(genres);
});

/**
 * Returns a genre with the given ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get("/:id", async (req, res) => {
  // fetch the genrer with the given object ID
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found.");
  }

  res.send(genre);
});

/**
 * Creates a new genre.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post("/", auth, async (req, res) => {
  // validate the request body using Joi
  const { error } = validateGenre(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const genre = new Genre(req.body);
  const result = await genre.save();
  res.send(result);
});

/**
 * Updates a genre with the given ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put("/:id", async (req, res) => {
  // first validate the request body using Joi
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
    },
    {
      new: true,
    }
  );
  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found.");
  }

  // return the genre just got updates
  return res.send(genre);
});

/**
 * Deletes a genre with the given ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found.");
  }

  res.send(genre);
});

module.exports = router;
