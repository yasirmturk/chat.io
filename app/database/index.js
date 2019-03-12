'use strict';

var config 		= require('../config');
var Mongoose 	= require('mongoose');
var logger 		= require('../logger');

// Connect to the database
// construct the database URI and encode username and password.
// var dbURI = "mongodb://" +
// 			encodeURIComponent(config.db.username) + ":" +
// 			encodeURIComponent(config.db.password) + "@" +
// 			config.db.host + ":" +
// 			config.db.port + "/" +
// 			config.db.name;
var dbURI = "mongodb://new-user_31:DWgAYE3JBCIwSb7L@cluster0-shard-00-00-v9ca0.mongodb.net:27017,cluster0-shard-00-01-v9ca0.mongodb.net:27017,cluster0-shard-00-02-v9ca0.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
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
		following: require('./schemas/following.js'),
		followed: require('./schemas/followed.js'),
		room: require('./schemas/room.js')
	}
};
