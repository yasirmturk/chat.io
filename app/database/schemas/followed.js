'use strict';

var Mongoose 	= require('mongoose');

var FollowedSchema = new Mongoose.Schema({
    userId: { type: String, required: true },
    connections: [{
			type: Mongoose.Schema.Types.ObjectId,
			ref: 'user'
		}]
});

var followedModel = Mongoose.model('followed', FollowedSchema);

module.exports = followedModel;
