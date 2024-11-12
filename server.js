const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/board");
const app = new express();
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(express.json()); // Add this line to parse JSON bodies

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://hpatel3291:hpatel3291@cluster0.7k9yms7.mongodb.net/capstpone_project"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Middleware
const authMiddleware = require("./middleware/authMiddleware");

//Dashboard Controller
const getDataCount = require("./controllers/dashboard/get_data_count");

//Auth Controller
const register = require("./controllers/auth/sign_up");
const login = require("./controllers/auth/sign_in");
const logout = require("./controllers/auth/logout");
const forgotPassword = require("./controllers/auth/forget_password");
const resetPassword = require("./controllers/auth/reset_password");

//Board Controller
const getBoards = require("./controllers/board/get_boards");
const createBoard = require("./controllers/board/create_board");
const selectBoard = require("./controllers/board/select_board");
const updateBoard = require("./controllers/board/update_board");
const closeBoard = require("./controllers/board/close_board");

//BoardMember Controller
const createBoardMember = require("./controllers/boardMember/create_board_member");

//Task Controller
const getTasks = require("./controllers/task/get_tasks");
const createTask = require("./controllers/task/create_task");
const selectTask = require("./controllers/task/select_task");
const updateTask = require("./controllers/task/update_task");
const deleteTask = require("./controllers/task/delete_task");

//Card Controller
const getCards = require("./controllers/card/get_cards");
const createCard = require("./controllers/card/create_card");
const selectCard = require("./controllers/card/select_card");
const updateCard = require("./controllers/card/update_card");
const deleteCard = require("./controllers/card/delete_card");

app.use(cors());
app.use(
  session({
    secret: "capstone4_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Authentication API
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);
app.post("/api/auth/forgot-password", forgotPassword);
app.post("/api/auth/reset-password/:token", resetPassword);

// Dashboard API
app.get("/api/dashboard", authMiddleware, getDataCount);

// Board API
app.get("/api/boards", authMiddleware, getBoards);
app.post("/api/board/create", authMiddleware, createBoard);
app.get("/api/board/:boardId", authMiddleware, selectBoard);
app.post("/api/board/update/:boardId", authMiddleware, updateBoard);
app.post("/api/board/close/:boardId", authMiddleware, closeBoard);

// BoardMember API
app.post("/api/board-member/create", authMiddleware, createBoardMember);

// Task API
app.get("/api/tasks/:boardId", authMiddleware, getTasks);
app.post("/api/task/create", authMiddleware, createTask);
app.get("/api/task/:taskId", authMiddleware, selectTask);
app.post("/api/task/update/:taskId", authMiddleware, updateTask);
app.post("/api/task/delete/:taskId", authMiddleware, deleteTask);

// Card API
app.get("/api/cards/:taskId", authMiddleware, getCards);
app.post("/api/card/create", authMiddleware, createCard);
app.get("/api/card/:cardId", authMiddleware, selectCard);
app.post("/api/card/update/:cardId", authMiddleware, updateCard);
app.post("/api/card/delete/:cardId", authMiddleware, deleteCard);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
