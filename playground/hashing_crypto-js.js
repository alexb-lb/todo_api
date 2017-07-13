/** Created by alex on 08.04.2017 **/
'use strict';
// this is expample how tokens works.
// to see how it works in jwt, see 'hashing_jwt.js'
const {SHA256} = require('crypto-js');

let message = 'Im am user number 235';
let hash = SHA256(message).toString(); // cause SHA256 returns object

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

// 1. user sends object with ID
let data = { id: 4 };

// 2. we hashing object, added some salt, and get result in string
let token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

// 3. the same operation, but instead data we pass in token.data
let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash){
  console.log('Data was not changed');
} else {
  console.log('Data was changed. Dont trust');
}

// if someone will try to change hash, he can send hash like this
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
// but he doesn't know secret word 'somesecret', so proverka will fail