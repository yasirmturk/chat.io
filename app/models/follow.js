'use strict';

var userModel = require('../database').models.user;
var followingModel = require('../database').models.following;
var followedModel = require('../database').models.followed;

var createUser = function (data, callback){
	var user = new userModel(data);
	user.save().then( newUser => {
		var followingModel = new followingModel({userId: newUser._id});
		followingModel.save().then(f => {
			callback(newUser, null)
		});
	}).catch(err => {
		callback(null, err);
	});
};

var follow = function(userId, leaderId, callback) {
	var newRoom = new followingModel(data);
	newRoom.save(callback);
}

module.exports = {
	createUser,
	follow
};
