
const postModel = require('../database').models.post;

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

module.exports = {
	create,
	feed,
};
