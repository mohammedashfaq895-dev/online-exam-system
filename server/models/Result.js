const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: String,
  quizId: String,
  score: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);