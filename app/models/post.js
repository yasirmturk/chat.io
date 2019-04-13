
const postModel = require('../database').models.post;
const userModel = require('../database').models.user;

const create = (data, callback) => {
	console.log(`postModel.create: ${JSON.stringify(data)}`);
  return new postModel(data).save(callback);
}

const feed = (users, callback) => {
	console.log(`postModel.feed: ${JSON.stringify(users)}`);
	return postModel.find({ creator: { $in: postModel.mapIDs(users) } })
	.populate('creator').then(result => {
		console.log(`feed count ${result.length}`);
		result.forEach(p => { p.viewCount += 1; p.save(); });
		callback(null, result);
	}).catch(err => {
		callback(err, null);
	});
}

const updateExpiry = (callback) => {
	return postModel.find({ expiryDate: null }).populate('creator')
	.then(posts => {
		console.log(`posts ${posts.length}`);
		posts.forEach(post => {
			const opt = post.creator.options.post;
			console.log(`opt ${opt.daysToKeep}`);
			post.expiryDate = new Date(+post.date + (opt.daysToKeep*24*60*60*1000));
			post.save();
		});
		callback();
	}).catch(err => {
		callback(err);
	});
}

const clean = (callback) => {
	const timestamp = new Date();
	console.log(`clean at ${timestamp}`);
	// return postModel.find({ expiryDate : { $lt: timestamp }})
	return postModel.deleteMany({ expiryDate : { $lt: timestamp }})
	.then(cnt => {
		console.log(`cleaned ${cnt} posts`);
		callback(null)
	}).catch(err => {
		callback(err)
	})
}

module.exports = {
	create,
	feed,
	updateExpiry,
	clean,
};
