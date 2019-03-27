
const feedModel = require('../database').models.feed;

const create = (data, callback) => {
		// console.log(`feedModel.create: ${JSON.stringify(data)}`);
		var post = new feedModel(data);
		return post.save(callback);
}

const fanout = (post, callback) => {
	const followers = post.creator.followers;
	console.log(`Start fanout ${followers.length}`);
	followers.forEach(f => {
		console.log(`faning for ${JSON.stringify(f)}`);
		// await create({owner: f, post: post});
	});
	callback(null, { success: true, count: followers.length} );
}

module.exports = {
	create,
	fanout,
};
