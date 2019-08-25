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

    router.get("/:id/edit", function(req, res){
        const id = req.params.id
        Pet.findById(id, function(err, pet){
            if(err) console.log(err)
            console.log(pet)
            res.render("dashboard/edit", {pet})
        })
    })

    router.post("/:id/edit", function(req, res){
        const id = req.params.id
        const { kind, breed, description, tags, sex, city, state, size, name, age, image } = req.body;
        const query = {_id: id}
        Pet.findOneAndUpdate(query, { kind, breed, description, tags, sex, city, state, size, name, age, image }, function(err, pet){
            if(err) console.log(err)
            res.redirect("/dashboard")
        })
    })

    return router
}

module.exports = dashboardRouter