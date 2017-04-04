/** Created by alex on 01.03.2017 **/
'use strict';
const mongoose = require('mongoose');

// change third-party librarie in mongoose with native JS promises
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = { mongoose };