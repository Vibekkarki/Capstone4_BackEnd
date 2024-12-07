const Board = require("../../models/Board");
const User = require("../../models/user");
const BoardMember = require("../../models/BoardMember");
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  const { boardId, email } = req.body;

  if (!boardId || !email) {
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

    const existingMember = await BoardMember.findOne({
      board_id: boardId,
      $or: [{ user_id: user ? user._id : null }, { invite_email: email }],
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ msg: "This member is already invited to the board." });
    }

    const newBoardMember = new BoardMember({
      board_id: board._id,
    });

    if (user) {
      newBoardMember.user_id = user._id;
    } else {
      newBoardMember.invite_email = email;
    }
    await newBoardMember.save();
    await sendInvitationEmail(email, board.name);
    res
      .status(200)
      .json({ msg: "Board member added successfully.", newBoardMember });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

async function sendInvitationEmail(email, boardName) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "hanipatel090@gmail.com",
      pass: "ecxv jbkh ukck vhwq",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: "hanipatel090@gmail.com",
    to: email,
    subject: `Invitation to join board: ${boardName}`,
    text: `You have been invited to join the board "${boardName}". Please log in to accept this invitation and view the board.`,
    html: `<p>You have been invited to join the board "<strong>${boardName}</strong>".</p>
           <p>Please log in to accept this invitation and view the board.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent to ${email}`);
  } catch (error) {
    console.error("Error sending invitation email:", error);
  }
}
