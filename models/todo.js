/** Created by alex on 01.03.2017 **/
'use strict';
const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true, // if no value exists, will be error
    minlength: 1, // check length
    trim: true // trim white spaces in the start and the on of the string
  },
  completed: {
    type: Boolean
  },
  time: {
    type: Number,
    default: null // value by default
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true // if no value exists, will be error
  }
});

module.exports = {Todo};