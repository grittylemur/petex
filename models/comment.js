const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    createdAt: Date
})

module.exports = mongoose.model("Comment", commentSchema)