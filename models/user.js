const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema
const Pet = require("./pet")

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
  }],
  savedPets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Pet'
    }
  ]
})

UserSchema.methods.addPet = async function(pet) {
  this.pets.push(pet)
  await this.save()
}

UserSchema.methods.getPets = async function() {
  return Pet.find({owner: this.id})
}

UserSchema.methods.getSavedPets = async function() {
  return Pet.find({_id: { $in: this.savedPets }})
}



UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
