const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models/user");

// create a router for authenticating the users
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    // first find the user with given email
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");
    console.log(user);
    // get the password from the existing user
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    res.send(validPassword);
  } catch (err) {
    res.status(500).send("Internal Server Error...");
  }
});

// validate function for validate the user object
function validate(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
}

module.exports = router;
