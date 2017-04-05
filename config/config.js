/** Created by alex on 05.04.2017 **/
'use strict';
// if server runs locally, NODE_ENV variable will not exists, so we set environment === 'development'
// if server runs via mocha, environment === 'test' (see 'scripts' in package.json)
// if server runs via Heroku.com, environment === 'production' by default
const env = process.env.NODE_ENV || 'development';

// set port and path to development and test DB if server runs locally
if(env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
