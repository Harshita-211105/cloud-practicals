const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title
        });

        await task.save();
        res.json(task);
    } catch (err) {
        console.log("POST ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.completed = !task.completed;
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});