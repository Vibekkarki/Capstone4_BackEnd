const Card = require("../../models/Card");

module.exports = async (req, res) => {
  const { boardId } = req.params;

  try {
    const cards = await Card.find({ board_id: boardId }).sort({ position: 1 });
    const groupedCards = cards.reduce((acc, card) => {
      if (!acc[card.position]) {
        acc[card.position] = [];
      }
      acc[card.position].push(card);
      return acc;
    }, {});

    res.status(200).json(groupedCards);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
