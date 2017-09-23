"use strict";
const assert = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');


// remove all Todos before testing, because we will expect length == 1
// of this collection below in tests
beforeEach(populateUsers);
beforeEach(populateTodos);

// Testing post
describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    // this text will be requested to the server
    var text = 'Test todo text';

    request(app)
      .post('/todos') // request to /todos
      .set('x-auth', users[0].tokens[0].token)
      .send({text}) // requesting text
      .expect(200) // expecting that server is running
      .expect((res) => {
        // expecting that response will be the same text as above
        assert(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        // if no errors, get all todos from DB, expect there will be only 1 document and it will contain text
        Todo.find({text}).then((todos) => {
          assert(todos.length).toBe(1);
          assert(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e)); // or throw error
      });
  });

  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos') // request to /todos
      .set('x-auth', users[0].tokens[0].token)
      .send({}) // requesting empty body
      .expect(400) // expecting that server is running
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        // if no errors, get all todos from DB, expect there will be only 1 document and it will contain text
        Todo.find().then((todos) => {
          assert(todos.length).toBe(2);
          done();
        }).catch((e) => done(e)); // or throw error
      });
  })
});

describe('GET /todos', () => {

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        assert(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // will be string like '58e20895f15ade11609642b4'
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        assert(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`) // will be string like '58e20895f15ade11609642b4'
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId}`) // will be string like '58e20895f15ade11609642b4'
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove todo ', (done) => {
    let hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        assert(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          assert(todo).toNotExist();
          done();
        }).catch((e) => {
          done(e);
        }); // or throw error
      });
  });

  it('should remove todo ', (done) => {
    let hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          assert(todo).toExist();
          done();
        }).catch((e) => {
          done(e);
        }); // or throw error
      });
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectId().toHexString();
    request(app)
      .delete(`/todos/${hexId}`) // will be string like '58e20895f15ade11609642b4'
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .delete(`/todos/123`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = "test updates 1";

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text, completed: true})
      .expect(200)
      .expect((res) => {
        assert(res.body.todo.text).toBe(text);
        assert(res.body.todo.completed).toBe(true);
        assert(res.body.todo.time).toBeA('number');
      })
      .end(done);
  });

  it('should not update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = "test updates 1";

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text, completed: true})
      .expect(404)
      .end(done);
  });

  it('should clear time when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = "test updates 2";

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text, completed: false})
      .expect(200)
      .expect((res) => {
        assert(res.body.todo.text).toBe(text);
        assert(res.body.todo.completed).toBe(false);
        assert(res.body.todo.time).toNotExist();
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let hexId = new ObjectId().toHexString();
    request(app)
      .patch(`/todos/${hexId}`) // will be string like '58e20895f15ade11609642b4'
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .patch(`/todos/123`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        assert(res.body._id).toBe(users[0]._id.toHexString());
        assert(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', '123')
      .expect(401)
      .expect((res) => {
        assert(res.body).toEqual({});
      })
      .end(done)
  });
});

describe('POST /users', () => {

  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'password';

    request(app)
      .post('/users')
      .send({email, password})
      .expect((res) => {
        assert(res.headers['x-auth']).toExist();
        assert(res.body._id).toExist();
        assert(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          assert(user).toExist();
          assert(user.password).toNotBe(password);
          done()
        }).catch((e) => done(e))
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'trulala', password: '123'})
      .expect(400)
      .end(done)
  });

  it('should not create a user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({email: users[0].email, password: users[0].password})
      .expect(400)
      .end(done)
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        assert(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id).then((user) => {
          assert(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth'] // tokens different - why?
          });
          done();
        }).catch((e) => done(e))
      })
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password + '1'})
      .expect(400)
      .expect((res) => {
        assert(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id).then((user) => {
          assert(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e))
      })
  })
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[0]._id).then((user) => {
          assert(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      })
  })
});