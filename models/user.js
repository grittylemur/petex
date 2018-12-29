const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  fName: String,
  lName: String,
  city: String,
  state: String,
  userType: String
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
