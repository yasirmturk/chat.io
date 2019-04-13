'use strict';

// Chat application dependencies
const compression = require('compression')
const express 		= require('express');
const app  				= express();
const path 				= require('path');
const bodyParser 	= require('body-parser');
const flash 			= require('connect-flash');
const jobs 				= require('./app/jobs');

// Chat application components
var routes 		= require('./app/routes');
var session 	= require('./app/session');
var passport    = require('./app/auth');
var passportInit = passport.initialize();
var passportSession = passport.session();

var ioServer 	= require('./app/socket')(app, session);
var logger 		= require('./app/logger');

console.log(`process.env: ${process.env.NODE_ENV}`);
// console.log(`process.env: ${JSON.stringify(process.env)}`);

// Set the port number
var port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(compression());

app.use(session);
app.use(passportInit);
app.use(passportSession);
app.use(flash());

app.use('/', routes);

// Middleware to catch 404 errors
app.use(function(req, res, next) {
  res.status(404).sendFile(process.cwd() + '/app/views/404.htm');
});

ioServer.listen(port);
