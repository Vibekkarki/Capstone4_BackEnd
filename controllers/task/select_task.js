const Task = require("../../models/Task");

module.exports = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
