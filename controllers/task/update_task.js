const Task = require("../../models/Task");
const Board = require("../../models/board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { taskId } = req.params;
  const { name, position } = req.body;

  if (!name || position === undefined) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  if (typeof position !== "number" || position < 0) {
    return res.status(400).json({ msg: "Position must be a positive number." });
  }

  try {
    const userId = req.session.userId;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const board = await Board.findById(task.board_id);
    const isOwner = board.owner_id.equals(userId);
    const isMember = await BoardMember.exists({
      board_id: board._id,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to update this task." });
    }

    const existingTask = await Task.findOne({
      board_id: task.board_id,
      position,
      _id: { $ne: taskId },
    });
    if (existingTask) {
      return res.status(400).json({
        msg: `A task with position ${position} already exists for this board.`,
      });
    }

    task.name = name;
    task.position = position;
    await task.save();

    res.status(200).json({ msg: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
