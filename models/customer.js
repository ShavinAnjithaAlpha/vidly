const Joi = require("joi");
const mongoose = require("mongoose");

// create a schema for the customer collection
const schemaCustomer = new mongoose.Schema({
  isGold: {
    type: Boolean,
    required: true,
    default: false,
  },
  name: {
    type: String,
    requires: true,
    minLength: 3,
    maxLength: 50,
  },
  phone: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
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

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
