require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const bcrypt = require("bcryptjs");

const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");

const app = express();

// ✅ CORS (safe default)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// =======================
// SERVE FRONTEND (React build)
// =======================
app.use(express.static(path.join(__dirname, "../client/dist")));

// =======================
// CREATE TABLES + SEED DATA
// =======================
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER,
      question TEXT,
      option1 TEXT,
      option2 TEXT,
      option3 TEXT,
      option4 TEXT,
      correct_answer INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      quiz_id INTEGER,
      score INTEGER,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed user
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (row.count === 0) {
      const hash = await bcrypt.hash("123456", 10);

      db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        ["test", "test@test.com", hash]
      );

      console.log("Sample user inserted");
    }
  });

  // Seed quiz
  db.get("SELECT COUNT(*) as count FROM quizzes", (err, row) => {
    if (row.count === 0) {
      db.run("INSERT INTO quizzes (title) VALUES (?)", ["Math Quiz"]);

      db.run(`
        INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [1, "2 + 2 = ?", "1", "2", "4", "5", 3]);

      db.run(`
        INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [1, "5 * 2 = ?", "5", "10", "15", "20", 2]);

      console.log("Sample quiz inserted");
    }
  });
});

// =======================
// API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);

// =======================
// FRONTEND FALLBACK (React Router)
// =======================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});