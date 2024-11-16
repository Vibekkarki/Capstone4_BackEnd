const Board = require("../../models/board");
const User = require("../../models/user");
module.exports = async (req, res) => {
  const { name, description } = req.body;
  const user = await User.findById(req.session.userId);

  try {
    if (user) {
      const board = new Board({
        owner_id: user._id,
        name: name,
        description: description,
      });

      await board.save();
      res.status(200).json({ msg: "Board created successfully.", board });
    } else {
      return res.status(400).json({ msg: "Please sign in to create a board." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
