const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

// create a schema for the customer collection
const schemaCustomer = new mongoose.Schema({
  isGold: { type: Boolean, required: true, default: false },
  name: { type: String, requires: true, minLength: 3, maxLength: 50 },
  phone: { type: String, required: true, minLength: 3, maxLength: 50 },
});

// create a model for the customer collection
const Customer = mongoose.model("Customer", schemaCustomer);

// create Joi schema for validattion of the customers
const schema = Joi.object({
  isGold: Joi.boolean(),
  name: Joi.string().min(3).max(50).required(),
  phone: Joi.string().min(3).max(50).required(),
});

/**
 * Validates the request body against the Joi schema
 * @param {Object} customer - The customer object to be validated
 * @returns {Object} - The result of the validation
 */
function validateCustomer(customer) {
  return schema.validate(customer);
}

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
  // first validate the request body
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const customer = Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      },
      { new: true }
    );

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
