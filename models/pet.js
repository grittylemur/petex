const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")

const PetSchema = new mongoose.Schema({
  name: String,
  age: String
});

PetSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Pet", PetSchema);
