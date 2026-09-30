const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database("./portfolio.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tech TEXT NOT NULL,
      link TEXT
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM projects", (err, row) => {
    if (!err && row.count === 0) {
      const stmt = db.prepare(
        "INSERT INTO projects (title, description, tech, link) VALUES (?, ?, ?, ?)"
      );
      stmt.run(
        "Personal Portfolio",
        "A responsive portfolio website showing profile, skills and projects.",
        "HTML, CSS, JavaScript, Node.js",
        "#"
      );
      stmt.run(
        "Student Project",
        "A sample project demonstrating problem solving and web development.",
        "JavaScript, HTML, CSS",
        "#"
      );
      stmt.finalize();
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/projects", (req, res) => {
  db.all("SELECT * FROM projects ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.post("/api/projects", (req, res) => {
  const { title, description, tech, link } = req.body;

  if (!title || !description || !tech) {
    return res.status(400).json({ error: "Title, description and tech are required." });
  }

  db.run(
    "INSERT INTO projects (title, description, tech, link) VALUES (?, ?, ?, ?)",
    [title, description, tech, link || "#"],
    function (err) {
      if (err) return res.status(500).json({ error: "Could not save project." });
      res.status(201).json({
        id: this.lastID,
        title,
        description,
        tech,
        link: link || "#"
      });
    }
  );
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});