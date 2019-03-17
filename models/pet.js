const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
const Schema = mongoose.Schema

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
  image: String,
  createdAt: Date,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comment"
    }
  ],
  views: {
    type: Number,
    default: 0
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

PetSchema.plugin(passportLocalMongoose)

PetSchema.methods.incrementViews = async function() {
  this.views += 1
  await this.save()
}

module.exports = mongoose.model("Pet", PetSchema);
