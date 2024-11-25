const Board = require("../../models/board");
const User = require("../../models/user");
module.exports = async (req, res) => {
  const board = await Board.findById(req.params.boardId);

  try {
    if (board && board.status == "inactive") {
      board.status = "delete";
      await board.save();
      const updatedBoard = await Board.findById(req.params.boardId);
      res
        .status(200)
        .json({ msg: "Board deleted successfully.", updatedBoard });
    } else if (board && board.status == "delete") {
      return res.status(400).json({ msg: "Board is already deleted." });
    } else {
      return res
        .status(400)
        .json({ msg: "The board is active and cannot be deleted." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
