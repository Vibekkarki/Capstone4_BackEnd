const Card = require("../../models/Card");
const Board = require("../../models/board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { cardId, newPosition } = req.body;

  if (!cardId || typeof newPosition !== "number" || newPosition < 0 || newPosition > 3) {
    return res.status(400).json({ msg: "Invalid card ID or position" });
  }

  try {
    const userId = req.session.userId;
    // Find the card and its associated board
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }
    const board = await Board.findById(card.board_id);
    const isOwner = board.owner_id.equals(userId);
    const isMember = await BoardMember.exists({
      board_id: card.board_id,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ msg: "Not authorized to update this card" });
    }

    // Update the card's position
    card.position = newPosition;
    await card.save();

    res.status(200).json({ msg: "Card position updated successfully", card });
  } catch (error) {
    console.error(error);
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};