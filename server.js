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
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


// insert new elem. Get user obj from DB by it token from client (in a authenticate), then save it
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then(
    (doc) => {
      res.send(doc)
    },
    (err) => {
      res.status(400).send(err)
    }
  )
});

// GET ALL elems created by this user. User info taken from authenticate func, which reads token from client
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({
      todos,
      status: "OK"
    })
  }).catch((e) => {
    res.status(400).send(e);
  }); // or throw error
});

// GET BY ID
app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// DELETE
app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// UPDATE
app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  // user can update only "text" and "completed" properties
  let body = _.pick(req.body, ['text'], 'completed');

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  // check if completed exists and if completed = true
  if (_.isBoolean(body.completed) && body.completed) {
    body.time = new Date().getTime();
  } else {
    body.completed = false;
    body.time = null; // to remove value from DB
  }

  // 1. id to be updated
  // 2. which properties will be updated
  // 3. new - is alias to "returnOriginal", choose - return old or updated doc
  Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    },
    {$set: body},
    {new: true})
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((err) => {
    res.status(400).send();
  });
});

// PRIVATE ROUTE WITH CHECKING AUTHENTICATE INFO
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((err) => {
    res.status(400).send(err);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    })
  }).catch((e) => {
    res.status(400).send();
  })
});

// logout
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send()
  })
});

app.listen(port, () => {
  console.log(`Started on port ${port}`)
});

module.exports = {app};