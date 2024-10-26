const Board = require("../../models/board");
const Task = require("../../models/Task");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  const { boardId, name, position } = req.body;

  if (!boardId || !name || !position) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  if (typeof position !== "number" || position < 0) {
    return res.status(400).json({ msg: "Position must be a positive number." });
  }

  try {
    const userId = req.session.userId;
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    const isOwner = board.owner_id.equals(userId);
    const isMember = await BoardMember.exists({
      board_id: boardId,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to add tasks to this board." });
    }

    const existingTask = await Task.findOne({ board_id: boardId, position });
    if (existingTask) {
      return res.status(400).json({
        msg: `A task with position ${position} already exists for this board.`,
      });
    }

    const task = new Task({
      board_id: boardId,
      name,
      position: position,
    });

    await task.save();
    res.status(200).json({ msg: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
