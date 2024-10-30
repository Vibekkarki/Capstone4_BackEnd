const Card = require("../../models/Card");
const Task = require("../../models/Task");
const Board = require("../../models/board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { cardId } = req.params;
  const { title, description, dueDate, position } = req.body;

  // Validate required fields
  if (!title || position === undefined) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  // Validate position as a positive number
  if (typeof position !== "number" || position < 0) {
    return res.status(400).json({ msg: "Position must be a positive number" });
  }

  try {
    const userId = req.session.userId;
    const card = await Card.findById(cardId).populate("task_id");

    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    const task = card.task_id;
    const board = await Board.findById(task.board_id);
    const isOwner = board.owner_id.equals(userId);
    const isMember = await BoardMember.exists({
      board_id: board._id,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res.status(403).json({ msg: "Unauthorized to update this card" });
    }

    // Check for position conflicts within the same task
    const existingCard = await Card.findOne({
      task_id: task._id,
      position,
      _id: { $ne: cardId },
    });
    if (existingCard) {
      return res.status(400).json({
        msg: `A card with position ${position} already exists within this task.`,
      });
    }

    // Update fields in the card
    card.title = title;
    card.description = description || card.description;
    card.dueDate = dueDate || card.dueDate;
    card.position = position;

    await card.save();

    res.status(200).json({ msg: "Card updated successfully", card });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
