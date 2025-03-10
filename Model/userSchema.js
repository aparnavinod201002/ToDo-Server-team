const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Employee'],
    required: true
  },
  assignedEmployees:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }]
});

const User = mongoose.model("User",userSchema)

// exports model
module.exports = User
