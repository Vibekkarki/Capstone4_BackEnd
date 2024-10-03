const express = require("express");
const Board = require("../models/board");
const User = require("../models/user");
const router = express.Router();

module.exports = router;

router.get("/boards", async (req, res) => {
  try {
    // Create a new board
    const boards = await Board.find({
      status: "active",
    });
    res.status(201).json({ boards: boards });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/board/create", async (req, res) => {
  const { name, description } = req.body;
  const user = await User.findById(req.session.userId);

  try {
    if (user) {
      // Create a new board
      const board = new Board({
        owner_id: user._id,
        name: name,
        description: description,
      });

      // Save the board to the database
      await board.save();
      res.status(201).json({ msg: "Board created successfully." });
    } else {
      return res.status(400).json({ msg: "Please sign in to create a board." });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/board/:boardId", async (req, res) => {
  try {
    // Get a board
    const board = await Board.findById(req.params.boardId);
    res.status(201).json({ board: board });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/board/update/:boardId", async (req, res) => {
  const { name, description } = req.body;
  // const user = await User.findById(req.session.userId);
  const board = await Board.findById(req.params.boardId);

  try {
    if (board && board.status == "active") {
      // update a board
      board.name = name;
      board.description = description;
      await board.save();
      res.status(201).json({ msg: "Board updated successfully." });
    } else {
      return res.status(400).json({ msg: "Board is not available" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/board/close/:boardId", async (req, res) => {
  const board = await Board.findById(req.params.boardId);

  try {
    if (board && board.status == "active") {
      // close a board
      board.status = "inactive";
      await board.save();
      res.status(201).json({ msg: "Board closed successfully." });
    } else {
      return res.status(400).json({ msg: "Board is not available" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});
