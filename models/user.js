/** Created by alex on 01.03.2017 **/
'use strict';
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
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

// overwriting existing method to hide other properties when this object will be send back to client
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// not arrow functions, cause it not bind 'this' keyword
UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';

  // userId already taken, auth - just word in DB, abc123 - secret
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  // save token in DB and return result to server.js to futher chaining (.then)
  return user.save().then(() => {
    return token;
  })
};

// not arrow functions, cause it not bind 'this' keyword
UserSchema.statics.findByToken = function (token) {
  let User = this;

  // undefined variable, if jwt.verify() throw an error, we can handle it
  let decoded;

  try {
    decoded = jwt.verify(token, 'secret')
  } catch (e){
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
};

// not arrow functions, cause it not bind 'this' keyword
UserSchema.pre('save', function (next) {
  let user = this;

  if(user.isModified('password')){
    // 1st arg - number of rounds to generate salt
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};