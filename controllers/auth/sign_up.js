const User = require("../../models/user");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({
      username,
      email,
      password: password,
    });
    await user.save();

    await BoardMember.updateMany(
      { invite_email: email },
      { $set: { user_id: user._id } }
    );

    res.status(200).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
