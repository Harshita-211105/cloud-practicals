const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("students.db");

app.use(express.json());
app.use(express.static("public"));

db.run(`
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    roll_no TEXT,
    email TEXT,
    course TEXT,
    year TEXT
)
`);

app.get("/students", (req, res) => {
    db.all("SELECT * FROM students ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get("/students/search/:roll_no", (req, res) => {
    db.get(
        "SELECT * FROM students WHERE roll_no = ?",
        [req.params.roll_no],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({ message: "Student not found" });
            }

            res.json(row);
        }
    );
});

app.post("/students", (req, res) => {
    const { name, roll_no, email, course, year } = req.body;

    db.run(
        "INSERT INTO students(name, roll_no, email, course, year) VALUES (?, ?, ?, ?, ?)",
        [name, roll_no, email, course, year],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Student added", id: this.lastID });
        }
    );
});

app.put("/students/:id", (req, res) => {
    const { name, roll_no, email, course, year } = req.body;

    db.run(
        "UPDATE students SET name = ?, roll_no = ?, email = ?, course = ?, year = ? WHERE id = ?",
        [name, roll_no, email, course, year, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Student updated" });
        }
    );
});

app.delete("/students/:id", (req, res) => {
    db.run(
        "DELETE FROM students WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Student deleted" });
        }
    );
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Student Record Management System running on port 3000");
});