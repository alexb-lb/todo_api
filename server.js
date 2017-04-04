/** Created by alex on 28.02.2017 **/
'use strict';
// node-modules
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

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then(
    (doc) => { res.send(doc) },
    (err) => { res.status(400).send(err) }
  )
});

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


app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectId.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started on port ${port}`)
});

module.exports = {app};