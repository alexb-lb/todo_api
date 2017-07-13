/** Created by alex on 13.07.2017 **/
'use strict';
const bcrypt = require('bcryptjs');

var pass = '123abc';

// 1st arg - number of rounds
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(pass, salt, (err, hash) => {
    console.log(hash)
  });
});


let hashedPass = '$2a$10$QopOdIzO3A0JdZuhEJiiQ.leBsmJ3vtjoJW5/4XVWrcx/8ByjPVg6';

bcrypt.compare(pass, hashedPass, (err, res) => {
  console.log(res)
})