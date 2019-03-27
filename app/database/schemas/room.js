'use strict';

const Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;

/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
 const RoomSchema = new Schema({
	 title: { type: String, required: true },
	 owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
	 connections: {
		 type: [{ userId: String, socketId: String }]
	 }
 });

module.exports = Mongoose.model('room', RoomSchema);
