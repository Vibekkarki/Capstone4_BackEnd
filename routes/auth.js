// const express = require("express");
// const bcrypt = require("bcryptjs");
// const User = require("../models/user");
// const router = express.Router();

// router.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ msg: "Please provide all fields" });
//   }

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "User already exists" });
//     }
//     user = new User({
//       username,
//       email,
//       password: password,
//     });
//     await user.save();
//     res.status(200).json({ msg: "User registered successfully" });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (user) {
//       bcrypt.compare(password, user.password, (error, same) => {
//         if (error) {
//           return res.status(500).json({ msg: "Server error" });
//         }

//         if (same) {
//           // Store user info in session
//           req.session.userId = user._id;
//           res.json({ msg: "Login successful", userId: user._id });
//         } else {
//           return res.status(400).json({ msg: "Invalid credentials" });
//         }
//       });
//     } else {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }
//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// router.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).json({ msg: "Logout failed" });
//     }
//     res.json({ msg: "Logout successful" });
//   });
// });

// router.post("/forgot-password", async (req, res) => {
//   const { email, new_password, confirm_password } = req.body;

//   if (!email || !new_password || !confirm_password) {
//     return res.status(400).json({
//       msg: "Please provide all fields.",
//     });
//   }

//   if (new_password !== confirm_password) {
//     return res.status(400).json({ msg: "Passwords do not match" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ msg: "User with this email does not exist" });
//     }

//     user.password = new_password;
//     await user.save();

//     res.json({ msg: "Password has been updated successfully" });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = router;
