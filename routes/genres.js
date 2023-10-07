const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const router = express.Router();

// create a schema for the genre collection
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  description: { type: String, required: false, minlength: 3, maxlength: 255 },
});

// create a model for the genre collection
const Genre = mongoose.model("Genre", genreSchema);

// create a Joi schema to validate the request body
const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(255),
});
// validate the request body against the Joi schema
function validate(genre) {
  return schema.validate(genre);
}

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
  try {
    const genre = await Genre.findById(req.params.id);

    if (!genre) {
      return res.status(404).send("The genre with the given ID was not found.");
    }

    res.send(genre);
  } catch (err) {
    res.status(400).send("Invalid ID.");
  }
});

/**
 * Creates a new genre.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post("/", async (req, res) => {
  // validate the request body using Joi
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  const genre = new Genre(req.body);
  try {
    const result = await genre.save();
    res.send(result);
  } catch (err) {
    res.status(404).send(err.details[0].message);
  }
});

/**
 * Updates a genre with the given ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put("/:id", async (req, res) => {
  // first validate the request body using Joi
  const { error } = validate(req.body);
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
  return res.send(result);
});

/**
 * Deletes a genre with the given ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) {
      return res.status(404).send("The genre with the given ID was not found.");
    }

    res.send(genre);
  } catch (err) {
    res.status(400).send("Invalid ID.");
  }
});

module.exports = router;
