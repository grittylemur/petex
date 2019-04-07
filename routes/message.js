const express = require("express")
const Message = require("../models/message")
const User = require("../models/user")
let router = express.Router()

const messageRouter = (app) => {
    router.get("/", function(req, res){
        Message.find({receiver: app.locals.currentUser.id} ,function(err, messages) {
            res.render("messages/index", {messages})
        })
        .sort({status: 'descending', dateSent: 'descending'})
    })

    router.get("/new", function(req, res){
        res.render("messages/new")
    })

    router.post("/", function(req, res){
        const {username, subject, body} = req.body
        User.findOne({username}, function(err, user){
            if (user) {
                const userId = user._id
                console.log(user)
                const newMessage = {
                    dateSent: new Date(),
                    sender: app.locals.currentUser.id,
                    senderUsername: app.locals.currentUser.username,
                    receiver: userId,
                    receiverUsername: username,
                    subject,
                    body
                }
                console.log(newMessage)
                Message.create(newMessage, function(err, newlyCreated){
                    if(err) {
                        console.log(err)
                    } else {
                        user.messages.push(newlyCreated)
                        user.save(function(err){
                            if(err) console.log(err)
                            res.redirect("/messages")
                        })
                    }
                })
            }
        })
    })

    router.get("/:id", function(req, res){
        const id = req.params.id
        if(id) {
            Message.findById(id, function(err, message){
                if(err) {
                    console.log(err)
                } else {
                    message.status = 'read'
                    message.save(function(err, message){
                        if(err) console.log(err)
                        res.render("messages/message", {message})
                    })
                }
            })
        }
    })

    router.post("/reply", function(req, res){
        console.log("Processing reply message...", req.body)
        const {subject, body, receiverUsername, receiverId} = req.body
        const senderUsername = currentUser.username
        // Find receiver user from Mongo
        User.findById(receiverId, function(err, user){
            if(err) {
                console.log(err)
            } else {
                const newMessage = {
                    subject,
                    body,
                    receiverUsername,
                    senderUsername,
                    receiver: receiverId,
                    sender: currentUser.id   
                }

                Message.create(newMessage, function(err, message){
                    if(err) {
                        console.log(err)
                    } else {
                        user.messages.push(message)
                        user.save(function(err, user){
                            if(err) {
                                console.log(err)
                            } else {
                                app.locals.unreadMessages = user.unreadMessages
                                res.redirect("/messages")
                            }
                        })
                    }
                })
        }
        
    })
        
    })

    router.get("/delete/:id", function(req, res){
        const id = req.params.id
        Message.remove({_id: id}, function(err){
            if(err) console.log(err)
            res.redirect("/messages")
        })
    })

    return router
}



module.exports = messageRouter