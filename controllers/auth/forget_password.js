const User = require("../../models/user");

module.exports = async (req, res) => {
  const { email, new_password, confirm_password } = req.body;

  if (!email || !new_password || !confirm_password) {
    return res.status(400).json({
      msg: "Please provide all fields.",
    });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist" });
    }

    user.password = new_password;
    await user.save();

    res.status(200).json({ msg: "Password has been updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
