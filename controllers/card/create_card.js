const Card = require("../../models/Card");
const Board = require("../../models/board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { boardId, title, description, dueDate, position } = req.body;

  if (!boardId || !title || typeof position !== "number" || position < 0) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const userId = req.session.userId;

    // Check if task exists
    // const task = await Task.findById(boardId).populate("board_id");
    // if (!task) {
    //   return res.status(404).json({ msg: "Task not found" });
    // }

    // const boardId = task.board_id._id;

    // Check if user is board owner or member
    const board = await Board.findById(boardId);
    const isOwner = board.owner_id.equals(userId);
    const isMember = await BoardMember.exists({
      board_id: boardId,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ msg: "Not authorized to add cards to this task" });
    }

    // Check if position already exists
    // const existingCard = await Card.findOne({ board_id: boardId, position });
    // if (existingCard) {
    //   return res
    //     .status(400)
    //     .json({
    //       msg: `A card with position ${position} already exists for this task.`,
    //     });
    // }

    // Create and save the card
    const card = new Card({
      board_id: boardId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      position,
    });

    await card.save();
    res.status(200).json({ msg: "Card created successfully", card });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
