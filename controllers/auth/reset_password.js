const bcrypt = require("bcryptjs");
const User = require("../../models/user");

module.exports = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Hash and set the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.isModified("password", false);
    user.resetInProgress = true; //disable the pre("save") hook which means it doesnt allow middleware to double bcrypt the password
    await user.save();
    user.resetInProgress = false; //enable the pre("save") hook

    res.status(200).json({ msg: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
