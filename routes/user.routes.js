const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();

// create a POST endpoint for the users
router.post("/", async (req, res) => {
  // first validate the user object
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // first validate if the user is not registered yet
    const searchedUser = await User.findOne({ email: req.body.email });
    if (searchedUser) return res.status(400).send("User already registered.");
    // create a User object uisng the request body
    const user = new User(_.pick(req.body, ["name", "email", "password"]));

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    // save the user object in the database
    const result = await user.save();

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(result, ["_id", "name", "email"]));
  } catch (err) {
    res.status(500).send("Internal Server Error...");
  }
});

module.exports = router;
