const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');

var User = require('../../models/user');
var Leaderboard = require('../../models/leaderboard');

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Leaderboard.topUsers( [id],(err, result) => {
		if(err) { return next(err); }

		return res.json({ success: true, topUsers: result });
	});
});

router.post('/follow/:userId', auth.required, (req, res, next) => {
	const { payload: { id } } = req;
	const { userId } = req.params;
	console.log('follow: ' + userId);

	return Leaderboard.follow(id, userId, (err, leader) => {
		if(err) { return next(err); }

		var l = leader.toObject();
		l.isFollowing = true;
		l.followerCount = l.followers.length;
		return res.json({ success: true, leader: l });
	});
});

router.post('/unfollow/:userId', auth.required, (req, res, next) => {
	const { payload: { id } } = req;
	const { userId } = req.params;
	console.log('un follow: ' + userId);

	return Leaderboard.unfollow(id, userId, (err, leader) => {
		if(err) { return next(err); }

		var l = leader.toObject();
		l.isFollowing = false;
		l.followerCount = l.followers.length;
		return res.json({ success: true, leader: l });
	});
});

module.exports = router;
