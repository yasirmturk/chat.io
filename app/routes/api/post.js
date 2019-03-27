const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');

const User = require('../../models/user');
const Post = require('../../models/post');
const Feed = require('../../models/feed');

router.post('/create', auth.required, (req, res, next) => {
  const { body: postData, payload: { id } } = req;
	console.log(`post/create: ${JSON.stringify(postData)}`);
  if(!postData) {
    return res.status(422).json({ errors: { content: 'is required' } });
  }

  // const { userId, ...rest } = postData
	// if(postData.userId !== id) {
	// 	return res.status(403).json({ errors: { action: 'is forbidden' } });
	// }

	User.findById(id, (err, user) => {
		if(err) { return next(err); }
		if(!user) { return res.sendStatus(403); }

			Post.create({ creator: user, ...postData }, (err, post) => {
				if(err) { return next(err); }

				// Feed.fanout(post, (err, done) => {
				// 	console.log(`Done fanout`);
				// });

				console.log(`Done post`);
				res.json({ success: true, post: post });
			});
	});

});

router.get('/feed', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

	User.findById(id, (err, user) => {
		if(err) { return next(err); }
		if(!user) { return res.sendStatus(403); }

		Post.feed(user.following.concat(id), (err, feed) => {
			if(err) { return next(err); }

			res.json({ success: true, feed: feed });
		});
	});
});

module.exports = router;
