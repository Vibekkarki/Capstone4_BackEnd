const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/board");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://hpatel3291:hpatel3291@cluster0.7k9yms7.mongodb.net/capstpone_project"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "capstone4_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", boardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
