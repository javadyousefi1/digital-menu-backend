const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
    title: { type: String, required: true, trim: true },
    isActive: { type: Boolean, required: true, defalt: true },
    image: { type: String, required: true, trim: true },

}, { timestamps: true, versionKey: false })

const categoryModel = model("category", categorySchema)

module.exports = { categoryModel }