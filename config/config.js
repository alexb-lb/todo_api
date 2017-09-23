/** Created by alex on 05.04.2017 **/
'use strict';
// if server runs locally, NODE_ENV variable will not exists, so we set environment === 'development'
// if server runs via mocha, environment === 'test' (see 'scripts' in package.json)
// if server runs via Heroku.com, environment === 'production' by default
const env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){
  // "require" automatically convert JSON to JS object
  let config = require('./config.json');
  let envConfig = config[env];

  // make array from object
  Object.keys(envConfig).forEach((key) =>{
    process.env[key] = envConfig[key];
  })
}