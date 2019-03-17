const express = require("express")
let router = express.Router()

const profileRouter = (app) => {
    router.get("/", function(req, res){
        res.render("profile/index")
    })
    return router
}

module.exports = profileRouter