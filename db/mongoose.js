/** Created by alex on 01.03.2017 **/
'use strict';
const mongoose = require('mongoose');

// change third-party library in mongoose with native JS promises
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };