const express = require("express");
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.json(quiz);
});

router.get("/", async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

router.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json(quiz);
});

router.post("/:id/submit", auth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  const { answers } = req.body;

  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (q.correctAnswer === answers[i]) score++;
  });

  await Result.create({
    userId: req.user.id,
    quizId: quiz._id,
    score
  });

  res.json({ score });
});

module.exports = router;