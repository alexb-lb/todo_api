/** Created by alex on 02.04.2017 **/
'use strict';
const {ObjectId} = require('mongodb');

const {mongoose} = require ('./../db/mongoose');
const {Todo} = require ('./../models/todo');

// to remove all from collection, pass in empty object
// Todo.remove({}).then((result) => {
//   console.log(result);
// });
//

// remove by property
Todo.findOneAndRemove({_id: '2231edwf21ddsfds21'}).then((result) => {
  console.log(result);
});


// remove by ID
Todo.findByIdAndRemove('2231edwf21ddsfds21').then((result) => {
  console.log(result);
});