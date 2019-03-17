const express = require("express");
var session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const moment = require("moment");
const User = require("./models/user");
const Message = require("./models/message")
const petsRoutes = require("./routes/pet");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message")
const dashboardRoutes = require("./routes/dashboard")
const profileRoutes = require("./routes/profile")
const settingsRoutes = require("./routes/settings")
const logger = require("./utils/logger");
require("dotenv").config();
const chalk = require("chalk");

const app = express();
var currentUser = null;

// App locals
app.locals.moment = moment;
app.locals.currentUser = currentUser;

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
  .then(() =>
    logger.log({
      level: "info",
      message: chalk.green("Connected to MongoDB")
    })
  );

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(session({ secret: "KHDFYG65GRAWRGARE" }));

const PORT = process.env.PORT || 5000;

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
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

// Custom middlewares
const messageMiddleware = function(req, res, next) {
  if(app.locals.currentUser) {
    Message.find({receiver: app.locals.currentUser.id, status: 'unread'}, function(err, messages){
      const len = messages.length
      app.locals.unreadMessages = len
    })
  }
  next()
}

app.use(messageMiddleware)

app.get("/", function(req, res) {
  // res.render("landing", { currentUser });
  res.redirect("/pets");
});

// Routes
app.use("/pets", petsRoutes(app));
app.use("/users", userRoutes(passport, app));
app.use("/messages", messageRoutes(app))
app.use("/dashboard", dashboardRoutes(app))
app.use("/profile", profileRoutes(app))
app.use("/settings", settingsRoutes(app))

app.listen(PORT, process.env.IP, function() {
  console.log(`Node server has started at http://localhost:${PORT}`);
  console.log("App is listening...");
});
