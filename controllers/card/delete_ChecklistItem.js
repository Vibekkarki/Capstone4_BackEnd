const Card = require("../../models/Card");

module.exports = async (req, res) => {
  const { cardId, checklistItemId } = req.params;

  if (!cardId || !checklistItemId) {
    return res.status(400).json({ msg: "Card ID and Checklist Item ID are required" });
  }

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    // Find the checklist item index
    const checklistItemIndex = card.checklist.findIndex((item) => {
        // Check for exact match after trimming and ensuring types are consistent
        return item._id.toString().trim() === checklistItemId.toString().trim();
      });

    if (checklistItemIndex === -1) {
      return res.status(404).json({ msg: "Checklist item not found" });
    }

    // Remove the checklist item
    card.checklist.splice(checklistItemIndex, 1);
    await card.save();

    res.status(200).json({ msg: "Checklist item deleted successfully", card });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
