const Board = require("../../models/Board");
const User = require("../../models/user");
module.exports = async (req, res) => {
  const board = await Board.findById(req.params.boardId);

  try {
    if (board && board.status == "inactive") {
      board.status = "active";
      await board.save();
      const updatedBoard = await Board.findById(req.params.boardId);
      res
        .status(200)
        .json({ msg: "Board reopened successfully.", updatedBoard });
    } else if (board && board.status == "delete") {
      return res.status(400).json({
        msg: "The board has already been deleted and cannot be reopened.",
      });
    } else if (board && board.status == "active") {
      return res.status(400).json({ msg: "Board is already active." });
    } else {
      return res.status(400).json({ msg: "Board is not available" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
