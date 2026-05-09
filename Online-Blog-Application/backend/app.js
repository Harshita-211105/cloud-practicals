const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Blog = require("./models/Blog");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

app.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/blogs", async (req, res) => {
    try {
        const blog = new Blog({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        });

        await blog.save();

        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/blogs/:id", async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
                author: req.body.author
            },
            { new: true }
        );

        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/blogs/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8002, () => {
    console.log("Blog Backend running on port 8002");
});