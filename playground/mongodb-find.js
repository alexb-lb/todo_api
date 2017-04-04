/** Created by alex on 24.02.2017 **/
'use strict';
const {MongoClient, ObjectId} = require('mongodb');

// 1st arg - url where DB lives, 2nd - callback
// MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
//   if(err){
//     return console.log('Unable to connect to MongoDB server');
//   }
//   console.log('Connected to MongoDB server');
//
//   // insert new document into collection
//   db.collection('Users').find().toArray().then((documents) => {
//     console.log('Todos');
//     console.log(JSON.stringify(documents, null, 2));
//   }, (err) => {
//     console.log('Unable to fetch todos', err);
//   });
//
//   db.close();
// });

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // insert new document into collection
  db.collection('Users').find({name: "Lol"}).toArray().then((documents) => {
    console.log('Todos');
    console.log(JSON.stringify(documents, null, 2));
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  db.close();
});