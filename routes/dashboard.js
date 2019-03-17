const express = require("express")
let router = express.Router()

const dashboardRouter = (app) => {
    router.get("/", function(req, res){
        res.render("dashboard/index")
    })
    return router
}

module.exports = dashboardRouter