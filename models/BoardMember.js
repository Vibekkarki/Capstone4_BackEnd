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
});

module.exports = mongoose.model("BoardMember", BoardMemberSchema);
