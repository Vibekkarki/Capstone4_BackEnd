const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user with a hashed password
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Store user info in session
    req.session.userId = user._id;
    res.json({ msg: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: "Logout failed" });
    }
    res.json({ msg: "Logout successful" });
  });
});

module.exports = router;
