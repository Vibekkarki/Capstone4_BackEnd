const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  card_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comment_text: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
