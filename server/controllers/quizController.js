const db = require("../config/db");

exports.getQuizzes = (req, res) => {
  db.all("SELECT * FROM quizzes", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.getQuizById = (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM quizzes WHERE id = ?", [id], (err, quiz) => {
    if (err) return res.status(500).json(err);

    db.all("SELECT * FROM questions WHERE quiz_id = ?", [id], (err, questions) => {
      if (err) return res.status(500).json(err);

      res.json({ ...quiz, questions });
    });
  });
};

exports.submitQuiz = (req, res) => {
  const quizId = req.params.id;
  const { answers } = req.body;

  db.all("SELECT * FROM questions WHERE quiz_id = ?", [quizId], (err, questions) => {
    if (err) return res.status(500).json(err);

    let score = 0;

    questions.forEach((q, i) => {
      if (q.correct_answer === answers[i]) score++;
    });

    db.run(
      "INSERT INTO results (user_id, quiz_id, score) VALUES (?, ?, ?)",
      [req.user.id, quizId, score],
      () => {
        res.json({ score });
      }
    );
  });
};