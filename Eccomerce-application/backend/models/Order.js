const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customerName: String,
        address: String,

        products: [
            {
                name: String,
                price: Number,
                quantity: Number
            }
        ],

        totalAmount: Number
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);