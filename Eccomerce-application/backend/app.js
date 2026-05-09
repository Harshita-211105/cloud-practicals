const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

/* Seed products */

const seedProducts = async () => {
    const count = await Product.countDocuments();

    await Product.deleteMany({});

        await Product.insertMany([
            {
                name: "Wireless Headphones",
                price: 2999,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
                category: "Audio",
                description: "Premium wireless headphones with noise cancellation."
            },
            {
                name: "Smart Watch",
                price: 4999,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
                category: "Wearables",
                description: "Modern smartwatch with fitness tracking."
            },
            {
                name: "Gaming Mouse",
                price: 1499,
                image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80",
                category: "Accessories",
                description: "High precision gaming mouse with RGB lighting."
            },
            {
                name: "Laptop Backpack",
                price: 1999,
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
                category: "Bags",
                description: "Water-resistant laptop backpack for daily use."
            },
            {
                name: "Bluetooth Speaker",
                price: 2499,
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
                category: "Audio",
                description: "Portable Bluetooth speaker with deep bass."
            },
            {
                name: "Mechanical Keyboard",
                price: 3499,
                image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
                category: "Accessories",
                description: "Mechanical keyboard with tactile switches."
            }
        ]);

        console.log("Products Seeded");
};

seedProducts();

/* Get products */

app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* Place order */

app.post("/orders", async (req, res) => {
    try {
        const order = new Order({
            customerName: req.body.customerName,
            address: req.body.address,
            products: req.body.products,
            totalAmount: req.body.totalAmount
        });

        await order.save();

        res.json({
            message: "Order placed successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(8004, () => {
    console.log("E-Commerce Backend running on port 8004");
});