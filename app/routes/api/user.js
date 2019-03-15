const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const auth = require('../auth');

var User = require('../../models/user');
var Room = require('../../models/room');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  const { body: user } = req;
  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

	// Check if the username already exists for non-social account
	User.findOne({'username': new RegExp('^' + user.username + '$', 'i'), 'socialId': null}, function(err, oldUser){
		if (err) { return next(err); }
		if (oldUser) {
			return res.status(422).json({
	      errors: {
	        username: 'is not available',
	      },
	    });
		} else {
			User.create(user, (err, finalUser) => {
				if(err) { return next(err); }
				Room.create({ title: finalUser.username, owner: finalUser }, function(err, newRoom){
					if(err) { return next(err); }

					res.json({ user: finalUser.toAuthJSON(), room: newRoom })
				});
			});
		}
	});
});

//POST login route (optional, everyone has access)
router.post('/authenticate', auth.optional, (req, res, next) => {
console.log(req.body);
  // const { body: { user } } = req;
	const { body: user } = req;

  if(!user || !user.username) {
    return res.status(422).json({
      errors: {
        username: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
    if(err) { return next(err); }

    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    }
		console.log(info);
    return res.status(400).json({errors: info});
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
	console.log(`obj session: ${req.session.passport}`);
	const { payload: { id } } = req;

	return User.findById(id, (err, user) => {
		if(err) { return next(err); }
		if(!user) { return res.sendStatus(400); }

		Room.findOrCreate({ title: user.username, owner: user }, function(err, newRoom){
			if(err) { return next(err); }

			res.json({ user: {...user.toAuthJSON(), profile: user }, room: newRoom })
		});
	});
});

module.exports = router;
