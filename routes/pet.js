const express = require("express");
var router = express.Router();
const Pet = require("../models/pet")
const Comment = require("../models/comment")
const Message = require("../models/message")
const logger = require("../utils/logger")
const isLoggedIn = require("../auth/isLoggedIn")

const petsRouter = (app) => {
router.get("/", function(req, res) {
  logger.info(req.user);

  let searchOptions = {};

  if (req.query.search) {
    searchOptions = { $text: { $search: req.query.search } };
  }

  const pageSize = 6;
  // Read page parameter from the querystring
  let { page } = req.query;
  // If page then pass that to pet.find()
  if (!page) {
    page = 1;
  }

  Pet.count(searchOptions, function(err, records) {
    if (err) {
      console.log("Error");
    }

    let pagination = {
      records,
      pageSize,
      page
    };

    Pet.find(searchOptions, function(err, pets) {
      res.render("index", { pets, err, pagination });
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: "desc" });
  });
});

router.get("/new", isLoggedIn, function(req, res) {
  res.render("new");
});

router.post("/", function(req, res) {
  const { kind, breed, description, tags, sex, city, state, size, name, age, image } = req.body;
  const newPet = { kind, breed, description, tags, sex, city, state, size, name, age, image, createdAt: new Date() };
  Pet.create(newPet, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/pets");
    }
  });
});

router.get("/:id", function(req, res){
  const id = req.params.id
  Pet.findOne({_id : id}, function(err, pet){
    Comment.find({
      "_id": { $in: pet.comments }
    }, function(err, comments){
      res.render("show", {pet, comments})
    })
    .sort({createdAt: 'desc'})
  })
})

router.post("/:id/comments", isLoggedIn, function(req, res) {
  Pet.findById(req.params.id, function(err, pet) {
    if (err) {
      console.log(err);
      res.redirect("/pets/" + req.params.id);
    } else {
      const text = req.body.text;
      const author = currentUser.username;
      Comment.create(
        {
          text,
          author,
          createdAt: new Date()
        },
        function(err, comment) {
          pet.comments.push(comment);
          pet.save();
          console.log("comment has been saved");
          res.redirect("/pets/" + pet._id + "#comments");
        }
      );
    }
  });
});

return router
}

module.exports = petsRouter