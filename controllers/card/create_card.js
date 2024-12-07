const Card = require("../../models/Card");
const Board = require("../../models/Board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { boardId, title, description, dueDate, position, assign_to, checklist } =
    req.body;

  if (
    !boardId ||
    !title ||
    !assign_to ||
    typeof position !== "number" ||
    position < 0
  ) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const userId = req.session.userId;

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

    const isBoardMember = await BoardMember.exists({
      board_id: boardId,
      user_id: assign_to,
    });

    if (!isBoardMember) {
      return res.status(400).json({
        msg: "User must be a board member to be assigned to this card.",
      });
    }

    let validatedChecklist = [];
    if (Array.isArray(checklist)) {
      validatedChecklist = checklist.map((item) => ({
        item: item.item,
        completed: item.completed || false,
      }));
    }

    // Create and save the card
    const card = new Card({
      board_id: boardId,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      position,
      assign_to,
      checklist: validatedChecklist,
    });

    await card.save();
    res.status(200).json({ msg: "Card created successfully", card });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
