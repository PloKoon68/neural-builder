const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


// DB functions inside the model file
const User = mongoose.model('users', userSchema);

const createUser = async (username, email, hashedPassword) => {
  // Hash password before saving
  return await User.create({ username, email, password: hashedPassword });
};

const getUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const getUserById = async (id) => {
  return await User.findById(id);
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserByEmail,
  getUserById
};


