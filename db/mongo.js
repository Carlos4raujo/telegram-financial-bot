const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI_STRING)

const User = mongoose.model("User", {
  first_name: String,
  last_name: String,
  id: Number,
  active: Boolean
})

const Message = mongoose.model("Message", {
  UserId: Number,
  active: Boolean,
  mount: Number,
})

module.exports = {
  User,
  Message
}
