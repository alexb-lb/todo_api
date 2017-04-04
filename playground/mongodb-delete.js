/** Created by alex on 24.02.2017 **/
'use strict';
const {MongoClient, ObjectId} = require('mongodb');

// 1st arg - url where DB lives, 2nd - callback
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // delete many
  // db.collection('Users').deleteMany({name: 'Lol'}).then((result) => {
  //   console.log(result);
  // });

  // delete one
  // db.collection('Users').deleteOne({name: 'Lol'}).then((result) => {
  //   console.log(result);
  // });

  // find and delete
  db.collection('Users').findOneAndDelete({name: 'Lol'}).then((result) => {
    console.log(result);
  });

  db.close();
});