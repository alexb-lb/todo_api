/** Created by alex on 24.02.2017 **/
'use strict';
const {MongoClient, ObjectId} = require('mongodb');

// 1st arg - url where DB lives, 2nd - callback
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // update document
  // documentation: https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate
  db.collection('Todos').findOneAndUpdate({
      _id: new ObjectId('58ac41e4ad995a06cc9c733f')
    }, {
      $set: {
        name: "Alex"
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    }
  ).then((result) => {
    console.log(result);
  });

  db.close();
});