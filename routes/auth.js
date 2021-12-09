var express = require('express');
var router = express.Router();
var keyStore = require('../key-store');

// Data dog stats
var StatsD = require('hot-shots');
var dogstatsd = new StatsD();



router.get('/', (req, res) => {
    dogstatsd.increment('auth.get');
    keyStore(req, res);
});


module.exports = router;
