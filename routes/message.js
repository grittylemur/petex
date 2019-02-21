const express = require("express")
const Message = require("../models/message")
const User = require("../models/user")
let router = express.Router()

const messageRouter = (app) => {
    router.get("/", function(req, res){
        Message.find({receiver: app.locals.currentUser.id} ,function(err, messages) {
            res.render("messages/index", {messages})
        })

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
                    sender: app.locals.currentUser.id,
                    receiver: userId,
                    subject,
                    body
                }
                Message.create(newMessage, function(err, newlyCreated){
                    if(err) {
                        console.log(err)
                    } else {
                        user.messages.push(newlyCreated)
                        user.unreadMessages += 1
                        user.save(function(err){
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
    return router
}



module.exports = messageRouter