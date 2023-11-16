const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  photoLink: String,
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;