const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  list_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Card", CardSchema);
