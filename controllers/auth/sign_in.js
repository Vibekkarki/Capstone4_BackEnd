const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide both email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, (error, same) => {
        if (error) {
          return res.status(500).json({ msg: "Server error" });
        }

        if (same) {
          // Store user info in session
          req.session.userId = user._id;
          res.status(200).json({ msg: "Login successful", userId: user._id });
        } else {
          return res.status(400).json({ msg: "Invalid credentials" });
        }
      });
    } else {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
