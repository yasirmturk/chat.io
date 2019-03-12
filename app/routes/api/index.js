const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/leaderboard', require('./leaderboard'));

module.exports = router;
