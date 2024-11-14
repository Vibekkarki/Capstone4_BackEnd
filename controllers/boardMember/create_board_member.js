const Board = require("../../models/board");
const User = require("../../models/user");
const BoardMember = require("../../models/BoardMember");
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  const { boardId, email, role } = req.body;

  if (!boardId || !email || !role) {
    return res.status(400).json({ msg: "Please provide all fields" });
  }

  try {
    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(400).json({ msg: "Board not found." });
    }

    if (board.owner_id.toString() !== req.session.userId) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to add members to this board." });
    }

    const user = await User.findOne({ email });
    const newBoardMember = new BoardMember({
      board_id: board._id,
      role,
    });

    if (user) {
      newBoardMember.user_id = user._id;
    } else {
      newBoardMember.invite_email = email;
    }
    await newBoardMember.save();
    // await sendInvitationEmail(email, board.name);
    res.status(200).json({ msg: "Board member added successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// async function sendInvitationEmail(email, boardName) {
//   const transporter = nodemailer.createTransport({
//     service: "Gmail", // or use another email provider
//     auth: {
//       user: "hanipatel090@gmail.com", // your email address
//       pass: "DoH@rdWorkT0GetSuccess", // your email password
//     },
//   });

//   const mailOptions = {
//     from: "hanipatel090@gmail.com",
//     to: email,
//     subject: `Invitation to join board: ${boardName}`,
//     text: `You have been invited to join the board "${boardName}". Please log in to accept this invitation and view the board.`,
//     html: `<p>You have been invited to join the board "<strong>${boardName}</strong>".</p>
//            <p>Please <a href="https://yourapp.com/login">log in</a> to accept this invitation and view the board.</p>`,
//   };

//   await transporter.sendMail(mailOptions);
// }
