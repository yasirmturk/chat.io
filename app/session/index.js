'use strict';

var session 	= require('express-session');
var MongoStore	= require('connect-mongo')(session);
var db 		    = require('../database');
var config 		= require('../config');

/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */
 var init = function () {
	 if(process.env.NODE_ENV === 'development') {
		 return session({
			 secret: config.sessionSecret,
			 resave: false,
			 unset: 'destroy',
			 saveUninitialized: true
		 });
	 } else {
		 return session({
			 secret: config.sessionSecret,
			 resave: false,
			 saveUninitialized: false,
			 unset: 'destroy',
			 store: new MongoStore({ mongooseConnection: db.Mongoose.connection })
		 });
	 }
 }

module.exports = init();
