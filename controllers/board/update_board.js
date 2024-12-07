const Board = require("../../models/Board");
const User = require("../../models/user");
module.exports = async (req, res) => {
  const { name, description } = req.body;
  const board = await Board.findById(req.params.boardId);

  try {
    if (board && board.status == "active") {
      board.name = name;
      board.description = description;
      await board.save();
      const updatedBoard = await Board.findById(req.params.boardId);

      res
        .status(200)
        .json({ msg: "Board updated successfully.", updatedBoard });
    } else {
      return res.status(400).json({ msg: "Board is not available" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
