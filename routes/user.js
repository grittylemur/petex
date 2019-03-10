const express = require("express");
var router = express.Router();
const chalk = require("chalk")
const logger = require("../utils/logger");
const isLoggedIn = require("../auth/isLoggedIn");
const User = require("../models/user");
let passport = require("passport");


module.exports = function(passport, app) {
    
  router.get("/new", function(req, res) {
    res.render("user/new");
  });

  router.post("/", function(req, res) {
    console.log(req.body);
    const {
      username,
      password,
      email,
      fName,
      lName,
      city,
      state,
      userType
    } = req.body;
    User.register(
      new User({ username, email, fName, lName, city, state, userType }),
      password,
      function(err, user) {
        if (err) {
          console.log(err);
        }

        passport.authenticate("local")(req, res, function() {
          logger.log({
            level: "info",
            message: chalk.green("User created successfully")
          });
          res.redirect("/pets");
        });
      }
    );
  });

  router.get("/signin", function(req, res) {
    res.render("user/signin");
  });

  router.post("/signin", passport.authenticate("local"), function(req, res) {
    currentUser = req.user;
    app.locals.currentUser = currentUser;
    res.redirect("/pets?user=" + req.user.username);
  });

  router.get("/signout", function(req, res) {
    app.locals.currentUser = null;
    req.logout();
    res.redirect("/");
  })
  
  return router;
};
