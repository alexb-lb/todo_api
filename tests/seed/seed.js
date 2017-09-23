/** Created by alex on 13.07.2017 **/
'use strict';
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

// Todos
const todos = [{
  _id: new ObjectId(),
  text: 'Some text 1',
  _creator: userOneId
}, {
  _id: new ObjectId(),
  text: 'Some text 2',
  completed: true,
  time: 333,
  _creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(() => done());
};

// Users
const users = [{
  _id: userOneId,
  email: 'test@gmail.com',
  password: '123456',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'test2@gmail.com',
  password: '654321',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(()=> {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
}


module.exports = {todos, populateTodos, users, populateUsers};