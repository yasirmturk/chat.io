'use strict';
// const dotenv = require('dotenv').config();

const init = function () {
	const env = process.env.NODE_ENV || 'development';
	if(env === 'production') {
		const redisURI 		= require('url').parse(process.env.REDIS_URL);
		const redisPassword 	= redisURI.auth.split(':')[1];
		return {
			db: {
				username: process.env.dbUsername,
				password: process.env.dbPassword,
				host: process.env.dbHost,
				port: process.env.dbPort,
				name: process.env.dbName,
				options: process.env.dbOptions,
			},
			sessionSecret: process.env.SESSION_SECRET,
			facebook: {
				clientID: process.env.facebookClientID,
				clientSecret: process.env.facebookClientSecret,
				callbackURL: "/auth/facebook/callback",
				profileFields: ['id', 'displayName', 'photos']
			},
			twitter:{
				consumerKey: process.env.twitterConsumerKey,
				consumerSecret: process.env.twitterConsumerSecret,
				callbackURL: "/auth/twitter/callback",
				profileFields: ['id', 'displayName', 'photos']
			},
			redis: {
				host: redisURI.hostname,
				port: redisURI.port,
				password: redisPassword
			},
			storage: {
					key: process.env.STORAGE_KEY,
					secret: process.env.STORAGE_SECRET,
					bucket: process.env.STORAGE_BUCKET,
					endPoint: process.env.STORAGE_ENDPOINT
			}
		}
	} else {
		return require('./config.json')[env];
	}
}

module.exports = init();
