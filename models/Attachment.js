const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema({
  card_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
  },
  filepath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Attachment", AttachmentSchema);
