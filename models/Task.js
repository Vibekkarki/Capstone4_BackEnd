const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  board_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  name: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    default: 0,
  },
});
TaskSchema.index({ board_id: 1, name: 1 }, { unique: true });
module.exports = mongoose.model("Task", TaskSchema);
