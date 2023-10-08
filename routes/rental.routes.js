const mongoose = require("mongoose");
const express = require("express");
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const router = express.Router();

// create endpoint for Rental API
router.get("/", async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    const rentals = await Rental.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({
        dateOut: -1,
        customer: 1,
        movie: 1,
      });

    res.send(rentals);
  } catch (err) {
    res.status(500).send("Internal Server Error...");
  }
});

router.post("/", async (req, res) => {
  // validate the request body
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // first fetch the corresponding movie and customer from the database
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Customer not found.");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send("Movie not found.");

    if (movie.numberInStock === 0)
      return res.status(400).send("Movies are out of stock.");

    // create a rental object using the fetched customer and movie
    let rental = new Rental({
      customer: {
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
      },
      movie: {
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    rental = await rental.save();
    // decrease the number of movie from the movie object
    movie.numberInStock--;
    movie.save();

    res.send(rental);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).send("Rental not found.");

    res.send(rental);
  } catch (err) {
    res.status(400).send("Invalid ID");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send("Rental not found.");

    res.send(rental);
  } catch (err) {
    res.send(400).send("Invalid ID.");
  }
});

module.exports = router;
