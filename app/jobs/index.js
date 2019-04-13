const schedule = require('node-schedule');

const Post = require('../models/post');




const init = function() {
	// const j1 = schedule.scheduleJob('0 * * * * *', function() {
	// 	console.log('The answer to life, the universe, and everything!');
	// });
	const j2 = schedule.scheduleJob('0 * * * * *', function() {
		Post.updateExpiry(() => {
			console.log(`updateExpiry`);
		})
	});
	const j3 = schedule.scheduleJob('0 * * * * *', function() {
		Post.clean(err => {
			console.log(`clean ${err}`);
		})
	});
}

module.exports = init();
