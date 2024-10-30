const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  dueDate: {
    type: Date,
    default: null,
  },
  position: {
    type: Number,
    default: 0,
  },
});

CardSchema.index({ task_id: 1, position: 1 }, { unique: true });

module.exports = mongoose.model("Card", CardSchema);
