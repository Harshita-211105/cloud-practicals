const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

/* Get all students */

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Search student by roll number */

app.get("/students/search/:rollNo", async (req, res) => {
    try {
        const student = await Student.findOne({
            rollNo: req.params.rollNo
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Add student */

app.post("/students", async (req, res) => {
    try {
        const existingStudent = await Student.findOne({
            rollNo: req.body.rollNo
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Roll number already exists"
            });
        }

        const student = new Student({
            name: req.body.name,
            rollNo: req.body.rollNo,
            email: req.body.email,
            course: req.body.course,
            year: req.body.year
        });

        await student.save();

        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Update student */

app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                rollNo: req.body.rollNo,
                email: req.body.email,
                course: req.body.course,
                year: req.body.year
            },
            { new: true }
        );

        res.json(updatedStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Delete student */

app.delete("/students/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);

        res.json({
            message: "Student deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8003, () => {
    console.log("Student Record Backend running on port 8003");
});