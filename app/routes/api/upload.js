
const router = require('express').Router();
const passport = require('passport');
const auth = require('../auth');

var User = require('../../models/user');

// const request 		= require('request');
// const fs 					= require('fs');
// const Transloadit = require('transloadit');
// const transloadit = new Transloadit({
// 	authKey   : '3ded348a27bc451ba950541ef103e635',
// 	authSecret: 'd24f21fc95f39e5980ff4e1d28812a5e66fb60a3'
// });
// const options = {
//   waitForCompletion: true,
//   params           : {
//     template_id: '36f9cd4db1244334a9767d6ac4c6c954',
//   },
// }

const aws 			= require('aws-sdk');
const multer 		= require('multer');
const multerS3 	= require('multer-s3');

aws.config.update({
    secretAccessKey: 'PkQQsCZuVPj/gg1LVKftawgdv3v5kWMTiwZXvTSK',
    accessKeyId: 'AKIAJ3ISSXXV4X334U3Q',
    region: 'us-east-1'
});
const s3  			= new aws.S3();

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'insightyasir',
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

	console.log(req.file);
	const file = req.file;

	User.updateDP(id, file.location, (err, data) => {
		if (err) { return next(err); }

		res.send({ success: true, picture: file.location });
	});

	// transloadit.addStream(file.etag, request(file.location).pipe(fs.createWriteStream(file.etag)));
	// transloadit.addFile(file.etag, file.location);
	// transloadit.createAssembly(options, (err, result) => {
	// 	if (err) { throw err }
	//
	// 	console.log({result})
	// });
	// res.send({ success: true, user: { _id: file.metadata.user, file: file.location } });
});

module.exports = router;
