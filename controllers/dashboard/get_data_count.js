const Task = require("../../models/Task");
const Card = require("../../models/Card");
const Board = require("../../models/board");
const BoardMember = require("../../models/BoardMember");
const User = require("../../models/user");

module.exports = async (req, res) => {
  try {
    const userId = req.session.userId;

    const userBoards = await Board.find({ owner_id: userId });
    const memberBoards = await BoardMember.find({ user_id: userId }).select(
      "board_id"
    );

    const boardIds = [
      ...userBoards.map((board) => board._id),
      ...memberBoards.map((member) => member.board_id),
    ];

    const cards = await Card.find({ board_id: { $in: boardIds } });
    const total = cards.length;
    const active = cards.filter((card) => card.position === 1).length;
    const inProgress = cards.filter((card) => card.position === 2).length;
    const completed = cards.filter((card) => card.position === 3).length;

    const activeUserCount = await User.countDocuments();

    res.status(200).json({
      total,
      active,
      in_progress: inProgress,
      completed,
      active_user: activeUserCount,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
