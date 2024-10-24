const User = require("../models/user");

module.exports = async (req, res, next) => {
  const user = await User.findById(req.session.userId);
  if (!user) {
    return res
      .status(401)
      .json({ msg: "Access denied. Please sign in to continue." });
  } else {
    // If user is authenticated, continue to the next middleware or controller
    next();
  }
};
