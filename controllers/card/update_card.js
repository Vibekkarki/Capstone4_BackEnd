const Card = require("../../models/Card");
const Board = require("../../models/board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { cardId } = req.params;
  const { title, description, dueDate, assign_to, checklist } = req.body;

  if (!title || !description || !assign_to) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const userId = req.session.userId;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    const board = await Board.findById(card.board_id);
    const isOwner = board.owner_id.equals(userId);
    const isMember = await BoardMember.exists({
      board_id: board._id,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res.status(403).json({ msg: "Unauthorized to update this card" });
    }

    const isBoardMember = await BoardMember.exists({
      board_id: board._id,
      user_id: assign_to,
    });

    if (!isBoardMember) {
      return res.status(400).json({
        msg: "User must be a board member to be assigned to this card.",
      });
    }

    // Update fields in the card
    card.title = title;
    card.description = description ? description : null;
    card.dueDate = dueDate ? new Date(dueDate) : null;
    card.assign_to = assign_to;

    // Update checklist if provided
    if (Array.isArray(checklist)) {
      card.checklist = checklist.map((item) => ({
        item: item.item,
        completed: item.completed || false,
      }));
    }

    await card.save();

    const updatedCard = await Card.findById(cardId)
      .populate("board_id")
      .populate("assign_to", "username email");

    res
      .status(200)
      .json({ msg: "Card updated successfully", card: updatedCard });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
