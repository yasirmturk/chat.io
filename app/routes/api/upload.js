
const router = require('express').Router();
const passport = require('passport');
const auth = require('../auth');

const config 	= require('../../config').storage;

var User = require('../../models/user');

const aws 			= require('aws-sdk');
const multer 		= require('multer');
const multerS3 	= require('multer-s3');

aws.config.update({
	secretAccessKey: config.secret,
	accessKeyId: config.key,
	region: 'us-east-1'
});

let options = {}
if (config.endPoint) {
	// Configure client for use with Spaces
	options['endpoint'] = new aws.Endpoint(config.endPoint);
}

const s3  	 = new aws.S3(options);
const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: config.bucket,
		acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
			const { payload: { id } } = req;
      cb(null, { user: id });
    },
		key: function (req, file, cb) {
			const { payload: { id } } = req;
			cb(null, `public/user/${id}`); //use Date.now() for unique file keys
		}
	})
});

//upload.array('upl', 1)
router.post('/dp', auth.required, upload.single('upl'), (req, res, next) => {
	const { payload: { id } } = req;
	console.log(`upload/dp: ${id}`);

	console.log(req.file);
	const file = req.file;

	User.updateDP(id, file.location, (err, data) => {
		if (err) { return next(err); }

		res.send({ success: true, picture: file.location });
	});
});

module.exports = router;
