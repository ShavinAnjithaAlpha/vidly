const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // get the user object from the requesr
  const user = req.user;
  // check if the user is admin
  if (!user.isAdmin)
    return res.status(403).send("Access denied. Admin previlege required.");

  next();
};
