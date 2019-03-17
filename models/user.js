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
    ref: 'Message'
  }],
  unreadMessages: {
    type: Number,
    default: 0
  },
  pets: [{
    type: Schema.Types.ObjectId,
    ref: 'Pet'
  }]
})

UserSchema.methods.addPet = async function(pet) {
  this.pets.push(pet)
  await this.save()
}

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
