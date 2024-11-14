const Card = require("../../models/Card");
const Board = require("../../models/board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { cardId } = req.params;

  try {
    const userId = req.session.userId;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    // const task = await Task.findById(card.task_id);
    // if (!task) {
    //   return res.status(404).json({ msg: "Task not found" });
    // }

    const board = await Board.findById(card.board_id);
    const isOwner = board.owner_id.equals(userId);
    const isMember = await BoardMember.exists({
      board_id: board._id,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to delete this card." });
    }

    await card.deleteOne();
    res.status(200).json({ msg: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
