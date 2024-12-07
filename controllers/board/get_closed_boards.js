const Board = require("../../models/Board");
const User = require("../../models/user");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const ownedBoards = await Board.find({
      owner_id: user._id,
      status: "inactive",
    });

    const memberBoards = await BoardMember.find({
      $or: [{ user_id: user._id }, { invite_email: user.email }],
    }).populate("board_id");

    const boards = [
      ...ownedBoards,
      ...memberBoards
        .map((bm) => bm.board_id)
        .filter((board) => board.status === "inactive"),
    ];

    // if (boards.length === 0) {
    //   return res.status(400).json({ msg: "No active boards found." });
    // }
    res.status(200).json({ boards: boards });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
