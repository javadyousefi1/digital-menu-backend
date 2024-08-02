const { Schema, model } = require("mongoose");
const { menuSchema } = require("../menu/menu.model");

const orderSchema = new Schema({
    deskNumber: { type: Number, required: true },
    status: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true, },
    order: [{ type: Object }],
}, { timestamps: true, versionKey: false });

const orderModel = model("order", orderSchema);

module.exports = { orderModel };
