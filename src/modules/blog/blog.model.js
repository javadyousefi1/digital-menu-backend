const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "category", required: true, trim: true },
    image: { type: String, required: true, trim: true },
    readingDuration: { type: Number, required: true, trim: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "tag" }],
    likes: { type: [String], required: false, trim: true, default: [] },
    comments: [{
        name: String,
        email: String,
        comment: String,
        _id: Schema.Types.ObjectId,
        isChecked: Boolean,
        reply: {
            userId: Schema.Types.ObjectId,
            replyText: String,
            isChecked: Boolean
        }
    }]
}, { timestamps: true, versionKey: false })

const blogModel = model("blog", blogSchema)

module.exports = { blogModel }