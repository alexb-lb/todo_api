/** Created by alex on 02.04.2017 **/
'use strict';
const {ObjectId} = require('mongodb');

const {mongoose} = require ('./../db/mongoose');
const {Todo} = require ('./../models/todo');

// id from existing collection in DB (like Todo);
let id = '58dab96b7049b013a8f86d12';

if(!ObjectId.isValid(id)){
  console.log('ID not valid!');
}

Todo.find({
  _id: id // mongoose automatically converts string ID into ObjectId
}).then((todos) => {
  console.log('Todos', todo)
});

Todo.findOne({
  _id: id // mongoose automatically converts string ID into ObjectId
}).then((todo) => {
  console.log('Todos', todo)
});

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('ID not found');
  }
  console.log('Todos', todo);
}).catch((e) => {
  console.log(e)
});