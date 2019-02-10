const express = require("express")
let router = express.Router()

router.get("/", function(req, res){
    res.render("messages/index")
})

module.exports = router