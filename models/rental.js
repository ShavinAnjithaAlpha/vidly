const mongoose = require("mongoose");
const Joi = require("joi");

// create a rental schema for rental collection
const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
      },
      isGold: {
        type: Boolean,
        required: true,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    requires: true,
    default: Date.now,
  },
  dateReturned: Date,
  rentalFee: {
    type: Number,
    requires: true,
    min: 0,
  },
});

// createa model according to the rental schema
const Rental = new mongoose.model("Rental", rentalSchema);

// create a Joi schema for validate the request body
const schema = Joi.object({
  customerId: Joi.string().required().min(5).max(255),
  movieId: Joi.string().required().min(5).max(255),
});

// function for validate the rental request body
function validateRental(rental) {
  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;
