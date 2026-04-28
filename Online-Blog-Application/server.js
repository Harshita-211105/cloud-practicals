const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("blog.db");

app.use(express.json());
app.use(express.static("public"));

db.run(`
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
)
`);

app.get("/posts", (req, res) => {
    db.all("SELECT * FROM posts ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post("/posts", (req, res) => {
    const { title, content } = req.body;

    db.run(
        "INSERT INTO posts(title, content) VALUES (?, ?)",
        [title, content],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Post Added", id: this.lastID });
        }
    );
});

app.delete("/posts/:id", (req, res) => {
    db.run("DELETE FROM posts WHERE id = ?", [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Deleted" });
    });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Correct blog server running on port 3000");
});