const Board = require("../../models/Board");
const User = require("../../models/user");
module.exports = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(400).json({ msg: "Board not found" });
    }
    res.status(200).json({ board: board });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
