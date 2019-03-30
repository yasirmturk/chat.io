'use strict';

const userModel = require('../database').models.user;

const create = function (data, callback){
	var newUser = new userModel(data);
	newUser.save(callback);
};

const findOne = function (data, callback){
	userModel.findOne(data, callback);
}

const findById = function (id, callback){
	userModel.findById(id, callback);
}

/**
 * Find a user, and create one if doesn't exist already.
 * This method is used ONLY to find user accounts registered via Social Authentication.
 *
 */
const findOrCreate = function(data, callback){
	findOne({'socialId': data.id}, function(err, user){
		if(err) { return callback(err); }
		if(user){
			return callback(err, user);
		} else {
			var userData = {
				username: data.displayName,
				socialId: data.id,
				picture: data.photos[0].value || null
			};

			// To avoid expired Facebook CDN URLs
			// Request user's profile picture using user id
			// @see http://stackoverflow.com/a/34593933/6649553
			if(data.provider == "facebook" && userData.picture){
				userData.picture = "http://graph.facebook.com/" + data.id + "/picture?type=large";
			}

			create(userData, function(err, newUser){
				callback(err, newUser);
			});
		}
	});
}

const updateDP = function (id, picture, callback) {
	// userModel.findByIdAndUpdate(id, { picture: picture })
	userModel.findById(id)
	.then(user => {
		user.picture = picture;
		user.save(callback);
		// callback(null, user);
	}).catch(err => {
		callback(err)
	});
}

/**
 * A middleware allows user to get access to pages ONLY if the user is already logged in.
 *
 */
 const isAuthenticated = (req, res, next) => {
	 if(req.isAuthenticated()){
		 next();
	 } else {
		 return res.status(401).json({
			 error: 'User not authenticated'
		 });
	 }
 }

/**
*
*/
const followers = (user, callback) => {
	return userModel.aggregate([{
		$match: { _id: { $in: userModel.mapIDs(user.followers) } }
	}, {
		$project: {
			username: 1,
			fullname: 1,
			email: 1,
			picture: 1,
			followerCount: { $size: "$followers" },
			followingCount: { $size: "$following" },
			isFollowing: { $setIsSubset: [[user._id], "$followers"] },
		}
	}]).then(result => {
		console.log(`followers count ${result.length}`);
		callback(null, result);
	}).catch(err => {
		callback(err, null);
	});
}

/**
*
*/
const followings = (user, callback) => {
	return userModel.aggregate([{
		$match: { _id: { $in: userModel.mapIDs(user.following) } }
	}, {
		$project: {
			username: 1,
			fullname: 1,
			email: 1,
			picture: 1,
			followerCount: { $size: "$followers" },
			followingCount: { $size: "$following" },
			isFollowing: { $setIsSubset: [[user._id], "$followers"] },
		}
	}]).then(result => {
		console.log(`followings count ${result.length}`);
		callback(null, result);
	}).catch(err => {
		callback(err, null);
	});
}

module.exports = {
	create,
	findOne,
	findById,
	findOrCreate,
	updateDP,
	isAuthenticated,
	followers,
	followings
};
