const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Registration = require("./models/Registration");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Error:", err));

app.get("/registrations", async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ createdAt: -1 });
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/registrations", async (req, res) => {
    try {
        const registration = new Registration({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            college: req.body.college,
            eventName: req.body.eventName
        });

        await registration.save();
        res.json({ message: "Registration successful", registration });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/registrations/:id", async (req, res) => {
    try {
        await Registration.findByIdAndDelete(req.params.id);
        res.json({ message: "Registration deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8001, () => {
    console.log("Event Registration Backend running on port 8001");
});