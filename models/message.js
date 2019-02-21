const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new mongoose.Schema({
    dateSent: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        enum: ['read', 'unread', 'starred', 'deleted'],
        default: 'unread' 
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    senderUsername: {
        type: String
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    receiverUsername: {
        type: String
    },
    subject: String,
    body: String
})

module.exports = mongoose.model("Message", messageSchema)