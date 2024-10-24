const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/board");
const app = new express();
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(express.json()); // Add this line to parse JSON bodies

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://hpatel3291:hpatel3291@cluster0.7k9yms7.mongodb.net/capstpone_project"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Middleware
const authMiddleware = require("./middleware/authMiddleware");

//Controller
const register = require("./controllers/auth/sign_up");
const login = require("./controllers/auth/sign_in");
const logout = require("./controllers/auth/logout");
const forgotPassword = require("./controllers/auth/forget_password");

app.use(cors());
app.use(
  session({
    secret: "capstone4_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Authentication API
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);
app.post("/api/auth/forgot-password", forgotPassword);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
