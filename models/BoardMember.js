const mongoose = require("mongoose");

const BoardMemberSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  invite_email: {
    type: String,
    required: false,
  },
  board_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  role: {
    type: String,
    enum: ["ProjectManager", "Developer", "TeamLeader", "Designer", "Tester"],
  },
});

module.exports = mongoose.model("BoardMember", BoardMemberSchema);
