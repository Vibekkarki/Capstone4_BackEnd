const Task = require("../../models/Task");

module.exports = async (req, res) => {
  const { boardId } = req.params;

  try {
    const tasks = await Task.find({ board_id: boardId }).sort({ position: 1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
