const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
});

module.exports = mongoose.model("Board", BoardSchema);
