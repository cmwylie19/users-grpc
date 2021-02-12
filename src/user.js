const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  tasks: { type: Array, default: [] },
  lists: { type: Array, default: [] },
  friends: { type: Array, default: [] },
  email: {
    type: String,
    unique: true, // `email` must be unique
  },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", User);
