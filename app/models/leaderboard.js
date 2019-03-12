'use strict';

var userModel = require('../database').models.user;
var followedModel = require('../database').models.followed;

var topUsers = function(excludeIds, callback) {
	return userModel.aggregate([{
		$match: { _id: { $nin: userModel.mapIDs(excludeIds) } }}, {
		// $unwind: "$followers" }, {
		$project: {
			username: 1,
			fullname: 1,
			email: 1,
			followers: 1,
			followerCount: { $size: "$followers" },
			// isFollowing: { $setIntersection: ["$followers", userModel.mapIDs(excludeIds)] },
			isFollowing: { $setIsSubset: [userModel.mapIDs(excludeIds), "$followers"] },
			// isFollowing3: { $in: [userModel.mapIDs(excludeIds)[0], "$followers"] },
			// isFollowing4: { $all: [userModel.mapIDs(excludeIds)[0], "$followers"] }
		} }, {
			// $addFields: { list: { $filter: { input: "$followers", as: "follower", cond: { $setIsSubset: [ ["$$follower._id"], userModel.mapIDs(excludeIds) ]} } } } }, {
		// $lookup: { from: "users", localField: "followers", foreignField: "_id", as: "me" } }, {
		// $unwind: "$followers" }, {
		$sort: { followerCount: -1 }}, {
		$limit: 10 }]).then(result => {
		console.log(`obj count ${result.length}`);
		callback(null, result);
	}).catch(err => {
		callback(err, null);
	});
}

var follow = function(id, leaderId, callback) {
	return userModel.findById(id).then(user => {
		userModel.findById(leaderId).then(leader => {

			  user.following.push(leader);
				user.save().then(u => {
					leader.followers.push(u);
					leader.save().then(l => {
						// l.isFollowing = true;
						// l.followerCount = l.followers.length;
						callback(null, l);
					}).catch((err) => {
						callback(err);
					});
				}).catch((err) => {
					callback(err);
				});
			// user.follow(leader).then(p => {
			// 	console.log('followed' + p);
			// 	callback(null);
			// }).catch((err) => {
			// 	callback(err);
			// });
		}).catch((err) => {
			callback(err);
		});
	}).catch((err) => {
		callback(err);
	});
}


var unfollow = function(id, leaderId, callback) {
	return userModel.findById(id).then(user => {
		userModel.findById(leaderId).then(leader => {

			  user.following.pull(leader);
				user.save().then(u => {
					leader.followers.pull(u);
					leader.save().then(l => {
						callback(null, l);
					}).catch((err) => {
						callback(err);
					});
				}).catch((err) => {
					callback(err);
				});
		}).catch((err) => {
			callback(err);
		});
	}).catch((err) => {
		callback(err);
	});
}

module.exports = {
	topUsers,
	follow,
	unfollow,
};
