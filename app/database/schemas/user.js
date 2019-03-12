'use strict';

var Mongoose 	= require('mongoose');
var Schema = Mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const SALT_WORK_FACTOR = 10;
const DEFAULT_USER_PICTURE = "/img/user.jpg";

/**
 * Every user has a username, password, socialId, and a picture.
 * If the user registered via username and password(i.e. LocalStrategy),
 *      then socialId should be null.
 * If the user registered via social authenticaton,
 *      then password should be null, and socialId should be assigned to a value.
 * 2. Hash user's password
 *
 */
 var UserSchema = new Schema({
	 email: { type: String, required: true, trim: true },
	 username: { type: String, required: true, trim: true },
	 fullname: { type: String, default: null },
	 picture:  { type: String, default: DEFAULT_USER_PICTURE},
	 password: { type: String, default: null },
	 socialId: { type: String, default: null },
	 accounts: [{
		 provider: { type: String, default: null },
		 uId: { type: String, default: null }
	 }],
	 // following: [ this ],
	 // followers: [ this ]
	 following: [{ type: Schema.Types.ObjectId, ref: 'user' }],
	 followers: [{ type: Schema.Types.ObjectId, ref: 'user' }]
 });

/**
 * Before save a user document, Make sure:
 * 1. User's picture is assigned, if not, assign it to default one.
 * 2. Hash user's password
 *
 */
UserSchema.pre('save', function(next) {
    var user = this;

    // ensure user picture is set
    if(!user.picture){
        user.picture = DEFAULT_USER_PICTURE;
    }

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/**
 * Create an Instance method to validate user's password
 * This method will be used to compare the given password with the passwoed stored in the database
 *
 */
UserSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

UserSchema.statics.mapIDs = ids => ids.map(id=>Mongoose.Types.ObjectId(id));

UserSchema.methods.follow = function(leader) {
  this.following.push(leader);
	leader.followers.push(this);
	return this.save();
};

// Create a user model
var userModel = Mongoose.model('user', UserSchema);

module.exports = userModel;
