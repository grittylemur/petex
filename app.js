const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Pet = require("./models/pet");
require("dotenv").config();
const chalk = require("chalk");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

// Logger
const logger = createLogger({
  format: format.combine(format.splat(), format.simple()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" })
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
    level: 'info',
    message: chalk.green("Connected to MongoDB")
  }));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 5000;

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/pets", function(req, res) {
  Pet.find({}, function(err, pets) {
    res.render("index", { pets, err });
  });
});

app.get("/pets/new", function(req, res) {
  res.render("new");
});

app.post("/pets", function(req, res) {
  const name = req.body.name;
  const age = req.body.age;
  const newPet = { name, age };
  Pet.create(newPet, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/pets");
    }
  });
});

app.listen(PORT, process.env.IP, function() {
  console.log(`Petex server has started at http://localhost:${PORT}`);
  console.log("App is listening...");
});
