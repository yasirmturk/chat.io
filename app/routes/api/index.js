const express = require('express');
const router = express.Router();

router.use('/upload', require('./upload'));
router.use('/user', require('./user'));
router.use('/leaderboard', require('./leaderboard'));
router.use('/post', require('./post'));

module.exports = router;
