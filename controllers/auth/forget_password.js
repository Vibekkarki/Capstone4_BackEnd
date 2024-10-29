const crypto = require("crypto");
const User = require("../../models/user");

module.exports = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Please provide an email address" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User with this email does not exist" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; // Token expires in 1 hour

    // Store token and expiration in user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    // Generate reset link
    const resetUrl = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    
    res.status(200).json({ msg: "Password reset link generated", resetUrl });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
