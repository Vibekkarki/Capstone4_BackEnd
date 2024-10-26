const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  board_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
