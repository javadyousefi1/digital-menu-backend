const { Schema, model } = require("mongoose");

const tagSchema = new Schema({
    title: { type: String, required: true, trim: true },
}, { timestamps: true, versionKey: false })

const tagModel = model("tag", tagSchema)

module.exports = { tagModel }