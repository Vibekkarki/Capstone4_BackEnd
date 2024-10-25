// const express = require("express");
// const Board = require("../models/board");
// const User = require("../models/user");
// const router = express.Router();

// module.exports = router;

// router.get("/boards", async (req, res) => {
//   try {
//     const boards = await Board.find({
//       status: "active",
//     });
//     if (boards.length === 0) {
//       return res.status(400).json({ msg: "No active boards found." });
//     }
//     res.status(200).json({ boards: boards });
//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// router.post("/board/create", async (req, res) => {
//   const { name, description } = req.body;
//   const user = await User.findById(req.session.userId);

//   try {
//     if (user) {
//       const board = new Board({
//         owner_id: user._id,
//         name: name,
//         description: description,
//       });

//       await board.save();
//       res.status(200).json({ msg: "Board created successfully." });
//     } else {
//       return res.status(400).json({ msg: "Please sign in to create a board." });
//     }
//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// router.get("/board/:boardId", async (req, res) => {
//   try {
//     const board = await Board.findById(req.params.boardId);
//     if (!board) {
//       return res.status(400).json({ msg: "Board not found" });
//     }
//     res.status(200).json({ board: board });
//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// router.post("/board/update/:boardId", async (req, res) => {
//   const { name, description } = req.body;
//   // const user = await User.findById(req.session.userId);
//   const board = await Board.findById(req.params.boardId);

//   try {
//     if (board && board.status == "active") {
//       board.name = name;
//       board.description = description;
//       await board.save();
//       res.status(200).json({ msg: "Board updated successfully." });
//     } else {
//       return res.status(400).json({ msg: "Board is not available" });
//     }
//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// router.post("/board/close/:boardId", async (req, res) => {
//   const board = await Board.findById(req.params.boardId);

//   try {
//     if (board && board.status == "active") {
//       board.status = "inactive";
//       await board.save();
//       res.status(200).json({ msg: "Board closed successfully." });
//     } else {
//       return res.status(400).json({ msg: "Board is not available" });
//     }
//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });
