const express = require("express");
var session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const moment = require("moment");
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")
const Pet = require("./models/pet");
const User = require("./models/user")
require("dotenv").config();
const chalk = require("chalk");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

let currentUser = null;

// Logger
const logger = createLogger({
  format: format.combine(format.splat(), format.simple()), transports: [
    new transports.Console(),   new transports.File({ filename: "combined.log" })
  ]
});

// App locals
app.locals.moment = moment
app.locals.currentUser = currentUser

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
app.use(session({ secret: "KHDFYG65GRAWRGARE" }));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(
  require("express-session")({
    secret: "CATZZARECUTE",
    resave: false,
    saveUninitialized: false
  })
);

const PORT = process.env.PORT || 5000;



app.get("/", function(req, res) {
  // res.render("landing", { currentUser }); 
  res.redirect("/pets");
});

app.get("/pets", function(req, res) {
  logger.info(req.user)
  if(req.user) {
    currentUser = req.user
  } 

  let searchOptions = {

  }

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
    .sort({createdAt: 'desc'})
  })
  
});

app.get("/pets/new", isLoggedIn, function(req, res) {
  res.render("new", {currentUser});
});

app.post("/pets", function(req, res) {
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

app.get("/pets/:id", function(req, res){
  const id = req.params.id
  Pet.findOne({_id : id}, function(err, pet){
    res.render("show", {pet})
  })
})

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

app.get("/signin", function(req, res){
  res.render("user/signin", {currentUser})
})

app.post("/signin",
  passport.authenticate("local"),
  function(req, res) {
    res.redirect("/pets?user=" + req.user.username)
  }
)

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect("/signin")
}

app.get('/signout', function(req, res){
  currentUser = null;
  req.logout();
  res.redirect('/pets');
});

app.listen(PORT, process.env.IP, function() {
  console.log(`Node server has started at http://localhost:${PORT}`);
  console.log("App is listening...");
});