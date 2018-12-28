const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")

const PetSchema = new mongoose.Schema({
  kind: String,
  breed: String,
  description: String,
  tags: String,
  sex: String,
  city: String,
  state: String,
  size: String,
  name: String,
  age: String,
  image: String
});

PetSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Pet", PetSchema);
