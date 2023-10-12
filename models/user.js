const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

// create a schema for model the users
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true, // email should be unique
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024, // hashed password will be longer than 1024 characters
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

// create the  model for the users
const User = mongoose.model("User", userSchema);

// create a validatiom schema for the users
const schema = Joi.object({
  name: Joi.string().required().min(5).max(255),
  email: Joi.string().required().min(5).max(255).email(),
  password: Joi.string().required().min(8).max(255),
});

// function for validating the users
function validateUser(user) {
  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
