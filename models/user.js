/** Created by alex on 01.03.2017 **/
'use strict';
const mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true, // if no value exists, will be error
    trim: true, // trim white spaces in the start and the on of the string
    minlength: 1 // check length
  }
});

module.exports = {User};