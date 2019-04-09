'use strict';

var config 		= require('../config').db;
var Mongoose 	= require('mongoose');
// var logger 		= require('../logger');

// Connect to the database
// construct the database URI and encode username and password.
var dbURI = "mongodb://" +
			encodeURIComponent(config.username) + ":" +
			encodeURIComponent(config.password) + "@" +
			config.host + ":" +
			config.port + "/" +
			config.name + "?" +
			config.options;
//console.log(`dbURI: ${dbURI}`);
Mongoose.connect(dbURI, { useNewUrlParser: true });

// Throw an error if the connection fails
Mongoose.connection.on('error', function(err) {
	if(err) throw err;
});

// mpromise (mongoose's default promise library) is deprecated,
// Plug-in your own promise library instead.
// Use native promises
Mongoose.Promise = global.Promise;

module.exports = { Mongoose,
	models: {
		user: require('./schemas/user.js'),
		post: require('./schemas/post.js'),
		feed: require('./schemas/feed.js'),
		room: require('./schemas/room.js')
	}
};
