const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres");

// create a schema for the movie collection
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    min: 5,
    max: 255,
  },
  genres: [
    {
      type: genreSchema,
      required: true,
    },
  ],
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
  },
});

// create a movie model using this schema
const Movie = mongoose.model("Movie", movieSchema);

// create a Joi schema to validate the request body
const schema = Joi.object({
  title: Joi.string().required().min(5).max(255),
  genreIds: Joi.array().items(Joi.string()).required(),
  numberInStock: Joi.number().required().min(0).max(255),
  dailyRentalRate: Joi.number().required().min(0).max(255),
});

// function for validating movie properties
function validateMovie(movie) {
  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
