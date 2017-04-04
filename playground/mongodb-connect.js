// const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require('mongodb').ObjectId;
// ES6 destruction. Just link methods to variables
const {MongoClient, ObjectId} = require('mongodb');

var obj = new ObjectId();
console.log(obj);

// 1st arg - url where DB lives, 2nd - callback
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // insert new document into collection
  db.collection('Users').insertOne({
    name: 'Lol',
    age: 30,
    location: 'Kiev'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert Users', err)
    }

    // show all docs
    console.log(JSON.stringify(result.ops, null, 2));
    console.log(result.ops[0]._id.getTimestamp());
  });

  db.close();
});