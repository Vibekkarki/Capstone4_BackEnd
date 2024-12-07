const Board = require("../../models/Board");
const User = require("../../models/user");
module.exports = async (req, res) => {
  const board = await Board.findById(req.params.boardId);

  try {
    if (board && board.status == "active") {
      board.status = "inactive";
      await board.save();
      const updatedBoard = await Board.findById(req.params.boardId);
      res.status(200).json({ msg: "Board closed successfully.", updatedBoard });
    } else {
      return res.status(400).json({ msg: "Board is not available" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
