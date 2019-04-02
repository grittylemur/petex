const express = require("express")
const Pet = require("../models/pet")
let router = express.Router()

const dashboardRouter = (app) => {
    router.get("/", async function(req, res){
        let pets = await app.locals.currentUser.getPets()
        res.render("dashboard/index", {pets})
    })

    router.get("/:id/delete", function(req, res){
        const id = req.params.id
        Pet.remove({_id: id}, function(err){
            if(err) console.log(err)
            res.redirect("/dashboard")
        })
    })
    return router
}

module.exports = dashboardRouter