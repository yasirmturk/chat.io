'use strict';

const Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;

const FeedSchema = new Schema({
	owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
	post: { type: Schema.Types.ObjectId, ref: 'post', required: true },
	date: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('feed', FeedSchema);
