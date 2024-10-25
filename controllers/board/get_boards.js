const Board = require("../../models/board");
const User = require("../../models/user");
module.exports = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const boards = await Board.find({
      owner_id: user._id,
      status: "active",
    });
    // if (boards.length === 0) {
    //   return res.status(400).json({ msg: "No active boards found." });
    // }
    res.status(200).json({ boards: boards });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
