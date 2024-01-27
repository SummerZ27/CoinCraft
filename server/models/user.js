const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  description: String,
  word1: String,
  word2: String,
  word3: String,
  myWord: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
