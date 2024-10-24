const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.hash(user.password, 10, (error, hash) => {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", UserSchema);
