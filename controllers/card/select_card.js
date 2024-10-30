const Card = require("../../models/Card");
const Task = require("../../models/Task");
const Board = require("../../models/board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId).populate("task_id");

    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    const task = await Task.findById(card.task_id);
    const board = await Board.findById(task.board_id);
    const userId = req.session.userId;
    const isOwner = board.owner_id.equals(userId);
    const isMember = await BoardMember.exists({
      board_id: board._id,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res.status(403).json({ msg: "You are not authorized to view this card." });
    }

    res.status(200).json({ card });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
