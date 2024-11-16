const User = require("../../models/user");
const BoardMember = require("../../models/BoardMember");

module.exports = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.session.userId;

    const loggedInUser = await User.findById(userId).select("email");
    if (!loggedInUser) {
      return res.status(404).json({ msg: "Logged-in user not found" });
    }

    const boardMembers = await BoardMember.find({
      board_id: boardId,
      user_id: { $exists: true },
    }).select("user_id invite_email");

    let formattedMembers = [];

    if (boardMembers.length > 0) {
      formattedMembers = boardMembers.map((member) => ({
        user_id: member.user_id,
        email: member.invite_email,
      }));
    }

    formattedMembers.push({
      user_id: userId,
      email: loggedInUser.email,
    });

    res.status(200).json({
      board_members: formattedMembers,
    });
  } catch (error) {
    console.error("Error fetching board members:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
