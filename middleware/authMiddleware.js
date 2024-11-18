const User = require("../models/user");

module.exports = async (req, res, next) => {
  console.log("Session data:", req.session); // Debug session data
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ msg: "Access denied. Please sign in to continue." });
  }
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res
      .status(401)
      .json({ msg: "Access denied. Please sign in to continue." });
  }
  next();
};
