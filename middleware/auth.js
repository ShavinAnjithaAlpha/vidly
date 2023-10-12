const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // get the token from the request header
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).send("Invalid token.");
  }
};
