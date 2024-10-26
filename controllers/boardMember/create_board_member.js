const Board = require("../../models/board");
const User = require("../../models/user");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { boardId, email, role } = req.body;

  if (!boardId || !email || !role) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(400).json({ msg: "Board not found." });
    }

    if (board.owner_id.toString() !== req.session.userId) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to add members to this board." });
    }

    const user = await User.findOne({ email });
    const newBoardMember = new BoardMember({
      board_id: board._id,
      role,
    });

    if (user) {
      newBoardMember.user_id = user._id;
    } else {
      newBoardMember.invite_email = email;
    }
    await newBoardMember.save();
    res.status(200).json({ msg: "Board member added successfully." });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
