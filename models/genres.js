const mongoose = require("mongoose");
const Joi = require("joi");

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
function validateGenre(genre) {
  return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
