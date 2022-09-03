const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI_STRING)

const User = mongoose.model("User", {
  first_name: String,
  last_name: String,
  id: Number,
  active: Boolean
})

const Movements = mongoose.model("Movements", {
  userId: Number,
  active: Boolean,
  amount: Number,
  date: Date,
  description: '',
})

module.exports = {
  User,
  Movements
}
