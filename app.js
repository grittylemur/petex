const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const Pet = require("./models/pet");
const User = require("./models/user")
require("dotenv").config();
const chalk = require("chalk");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

// Logger
const logger = createLogger({
  format: format.combine(format.splat(), format.simple()), transports: [
    new transports.Console(),   new transports.File({ filename: "combined.log" })
  ]
});

app.use(express.static(__dirname + "/public"));

// Local Mongo
// mongoose.connect("mongodb://localhost/petex");

// MLab
mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${
      process.env.DB_INSTANCE
    }`
  )
  .then(() => logger.log({
    level: 'info',   message: chalk.green("Connected to MongoDB")
  }));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(
  require("express-session")({
    secret: "CATZZARECUTE",
    resave: false,
    saveUninitialized: false
  })
);

const PORT = process.env.PORT || 5000;

const currentUser = null;

app.get("/", function(req, res) {
  // res.render("landing", { currentUser }); 
  res.redirect("/pets");
});

app.get("/pets", function(req, res) {
  let searchOptions = {}

  if(req.query.search) {
    searchOptions = 
    { $text: { $search: req.query.search } }
  }
  
  const pageSize = 6
  // Read page parameter from the querystring
  let {page} = req.query
  // If page then pass that to pet.find()
  if(!page) {
    page = 1
  }

  Pet.count(searchOptions, function (err, records) {
    if (err) {console.log('Error')}

    let pagination = {
      records,
      pageSize,
      page
    }
  
    Pet.find(searchOptions, function(err, pets) {
      res.render("index", { pets, err, currentUser, pagination });
    })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
  })
  
});

app.get("/pets/new", function(req, res) {
  res.render("new", {currentUser});
});

app.post("/pets", function(req, res) {
  const { kind, breed, description, tags, sex, city, state, size, name, age, image } = req.body;
  const newPet = { kind, breed, description, tags, sex, city, state, size, name, age, image };
  Pet.create(newPet, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/pets");
    }
  });
});

// USER ROUTES

app.get("/users/new", function(req, res){
  res.render("user/new", {currentUser})
})

app.post("/users", function(req, res){
  console.log(req.body)
  const {username, password, email, fName, lName, city, state, userType} = req.body
  User.register(
    new User({username, email, fName, lName, city, state, userType}),
    password,
    function(err, user) {
      if(err) {
        console.log(err)
      }

      passport.authenticate("local")(req, res, function() {
        logger.log({
          level: 'info',   message: chalk.green("User created successfully")
        })
        res.redirect("/pets")
      })
    }
  )
})

app.listen(PORT, process.env.IP, function() {
  console.log(`Node server has started at http://localhost:${PORT}`);
  console.log("App is listening...");
});