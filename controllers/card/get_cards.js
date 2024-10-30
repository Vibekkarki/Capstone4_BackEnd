const Card = require("../../models/Card");

module.exports = async (req, res) => {
  const { taskId } = req.params;

  try {
    const cards = await Card.find({ task_id: taskId }).sort({ position: 1 });
    res.status(200).json({ cards });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
