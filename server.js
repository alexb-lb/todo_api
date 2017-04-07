/** Created by alex on 28.02.2017 **/
'use strict';
require('./config/config');

// node-modules
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

// models
const mongoose = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// INSERT
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(
    (doc) => { res.send(doc) },
    (err) => { res.status(400).send(err) }
  )
});

// GET ALL
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos,
      status: "OK"
    })
  }).catch((e) =>{
    res.status(400).send(e);
  }); // or throw error
});

// GET BY ID
app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// DELETE
app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// UPDATE
app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;

  // user can update only "text" and "completed" properties
  let body = _.pick(req.body, ['text'], 'completed');

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  // check if completed exists and if completed = true
  if(_.isBoolean(body.completed) && body.completed){
    body.time = new Date().getTime();
  } else {
    body.completed = false;
    body.time = null; // to remove value from DB
  }

  // 1. id to be updated
  // 2. which properties will be updated
  // 3. new - is alias to "returnOriginal", choose - return old or updated doc
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});


// INSERT USER EMAIL
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(
    (doc) => { res.send(doc) },
    (err) => { res.status(400).send(err) }
  )
});



app.listen(port, () => {
  console.log(`Started on port ${port}`)
});

module.exports = {app};