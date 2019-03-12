'use strict';

var Mongoose 	= require('mongoose');
var Schema = Mongoose.Schema;

var FollowingSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	connections: [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}]
});

var followingModel = Mongoose.model('following', FollowingSchema);

module.exports = followingModel;
