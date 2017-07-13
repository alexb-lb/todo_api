/** Created by alex on 08.04.2017 **/
'use strict';
// this is the easy example, for info how it works see 'hashing_crypto-js.js'
const jwt = require('jsonwebtoken');

let data = { id: 10 };

// secret as second parameter
let token = jwt.sign(data, '123abc');
console.log(token);

let decoded = jwt.verify(token, '123abc');
console.log(decoded)