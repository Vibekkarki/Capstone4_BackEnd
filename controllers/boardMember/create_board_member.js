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

    const loginUser = await User.findById(req.session.userId);
    await sendInvitationEmail(
      loginUser.email,
      loginUser.username,
      email,
      board.name
    );
    res
      .status(200)
      .json({ msg: "Board member added successfully.", newBoardMember });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

async function sendInvitationEmail(
  inviterEmail,
  inviterName,
  recipientEmail,
  boardName
) {
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
    from: `"SmartBoard Team" <hanipatel090@gmail.com>`, // Professional sender name
    to: recipientEmail,
    subject: `You are invited to join the board: ${boardName}`,
    text: `Hello,

${
  inviterName || inviterEmail
} has invited you to join the board "${boardName}" on SmartBoard.

Please log in or create an account to accept this invitation and start collaborating on the board.

Best regards,
The SmartBoard Team
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h3 style="color: #0056b3;">Hello,</h3>
        <p>
          <strong>${inviterName}</strong> (${inviterEmail}) has invited you to join the board 
          "<strong>${boardName}</strong>" on SmartBoard.
        </p>
        <p>
          Please log in or create an account to accept this invitation and start collaborating on the board.
        </p>
        <p style="font-size: 0.9em; color: #555;">
          If you have any questions or need assistance, feel free to reach out to us.
        </p>
        <p style="margin-top: 20px;">
          Best regards,<br>
          <strong>The SmartBoard Team</strong>
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent to ${recipientEmail}`);
  } catch (error) {
    console.error("Error sending invitation email:", error);
  }
}
