const express = require("express")
let router = express.Router()

const settingsRouter = (app) => {
    router.get("/", function(req, res){
        res.render("settings/index")
    })
    return router
}

module.exports = settingsRouter