const mongoose = require("mongoose")
const Schema = mongoose.Schema


const messageSchema = new mongoose.Schema({
    dateSent: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        enum: ['read', 'unread', 'starred', 'deleted']
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    subject: String,
    body: String
})