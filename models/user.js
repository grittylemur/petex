const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  fName: String,
  lName: String,
  city: String,
  state: String,
  userType: String,
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'message'
  }],
  unreadMessages: {
    type: Number,
    default: 0
  }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
