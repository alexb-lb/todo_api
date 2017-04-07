/** Created by alex on 01.03.2017 **/
'use strict';
const mongoose = require('mongoose');
const validator =  require ('validator');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true, // if no value exists, will be error
    trim: true, // trim white spaces in the start and the on of the string
    minlength: 1, // check length
    unique: true, // unique restriction, cannot be two same emails
    validate: {
      // built-in validate function in mongoose.js
      validator: validator.isEmail // and this is third party library named 'validator'
    },
    message: '{VALUE} is not a valid email',
  },
  password: {
    type: String,
    required: true, // if no value exists, will be error
    trim: true, // trim white spaces in the start and the on of the string
    minlength: 6 // check length
  },
  tokens: [{
    access: {
      type: String,
      required: true, // if no value exists, will be error
    },
    token: {
      type: String,
      required: true, // if no value exists, will be error
    }
  }]
});

module.exports = {User};