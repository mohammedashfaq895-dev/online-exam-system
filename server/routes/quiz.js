const express = require("express");
const {
  getQuizzes,
  getQuizById,
  submitQuiz
} = require("../controllers/quizController");

const auth = require("../middleware/auth");

const router = express.Router();

// Get all quizzes
router.get("/", getQuizzes);

// Get single quiz with questions
router.get("/:id", getQuizById);

// Submit quiz
router.post("/:id/submit", auth, submitQuiz);

module.exports = router;