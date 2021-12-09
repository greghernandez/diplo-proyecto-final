var express = require('express');
var router = express.Router();

// Data dog stats
var StatsD = require('hot-shots');
var dogstatsd = new StatsD();

/* GET home page. */
router.get('/', function(req, res, next) {
  dogstatsd.increment('page.views')
  res.send('<p>HTML Data</p>');
});

module.exports = router;
