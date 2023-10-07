const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customer");

/**
 * Fetches all the customers from the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The list of customers
 */
router.get("/", async (req, res) => {
  // ectract the page size and the page number
  const pageSize = parseInt(req.query.pageSize) || 10;
  const pageNumber = parseInt(req.query.pageNumber) || 1;

  // fetch the customers from the database
  try {
    const customers = await Customer.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ name: 1, phone: 1, isGold: 1 });

    res.send(customers);
  } catch (err) {
    res.status(500).send("Internal Server Error.");
  }
});

/**
 * Creates a new customer in the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The newly created customer object
 */
router.post("/", async (req, res) => {
  // first validate the request body
  const { error } = validateCustomer(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    // create a new customer object
    const customer = new Customer(req.body);
    const result = await customer.save();

    res.send(result);
  } catch (err) {
    res.status(500).send("Internal Server Error.");
  }
});

/**
 * Updates an existing customer in the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The updated customer object
 */
router.put("/:id", async (req, res) => {
  // first validate the request body using Joi
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    {
      new: true,
    }
  );
  if (!customer) {
    return res.status(404).send("The genre with the given ID was not found.");
  }

  // return the genre just got updates
  return res.send(customer);
});

/**
 * Deletes an existing customer from the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The deleted customer object
 */
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
    }

    res.send(customer);
  } catch (err) {
    res.status(400).send("Invalid ID.");
  }
});

/**
 * Fetches a single customer from the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The customer object
 */
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res
        .status(404)
        .send("The customer with the given ID was not found.");
    }

    res.send(customer);
  } catch (err) {
    res.status(400).send("Invalid ID.");
  }
});

module.exports = router;
