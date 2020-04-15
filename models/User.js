const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//The result of the method mongoose.model() gives us the all powerful model object that can query the database. User is the collection.
//is 'user' supposed to be 'User'?  Possible problem.
const User = mongoose.model('user', UserSchema);
module.exports = User;
