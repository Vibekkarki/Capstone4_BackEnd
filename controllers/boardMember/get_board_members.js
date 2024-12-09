const User = require("../../models/user");
const Board = require("../../models/Board");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.session.userId;

    const loggedInUser = await User.findById(userId).select("email");
    if (!loggedInUser) {
      return res.status(404).json({ msg: "Logged-in user not found" });
    }

    const board = await Board.findById(boardId).select("owner_id");
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    const isOwner = board.owner_id.toString() === userId;
    const isMember = await BoardMember.exists({
      board_id: boardId,
      user_id: userId,
    });

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to view members of this board" });
    }

    const boardMembers = await BoardMember.find({ board_id: boardId }).select(
      "user_id invite_email"
    );

    const userIds = new Set(
      boardMembers.map((member) => member.user_id.toString())
    );

    userIds.add(board.owner_id.toString());

    // Fetch emails for all user_ids
    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select(
      "email"
    );

    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user.email;
      return map;
    }, {});

    const formattedMembers = boardMembers.map((member) => ({
      user_id: member.user_id,
      email: userMap[member.user_id.toString()] || member.invite_email,
    }));

    if (
      !formattedMembers.some(
        (m) => m.user_id.toString() === board.owner_id.toString()
      )
    ) {
      formattedMembers.push({
        user_id: board.owner_id,
        email: userMap[board.owner_id.toString()],
      });
    }

    const uniqueMembers = Array.from(
      new Map(formattedMembers.map((m) => [m.user_id.toString(), m])).values()
    );

    res.status(200).json({
      board_members: uniqueMembers,
    });
  } catch (error) {
    console.error("Error fetching board members:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
