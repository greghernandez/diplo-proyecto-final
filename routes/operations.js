var express = require('express');
var router = express.Router();
var operationsController = require('../controllers/operations.controller');
var middleware = require('../middleware');

// Data dog stats
var StatsD = require('hot-shots');
var dogstatsd = new StatsD();


router.use(middleware);

router
    .get('/sum/:a/:b', (req, res) => {
        dogstatsd.increment('operations.sum');
        operationsController.sum(req, res)
    })
    .get('/subtract/:a/:b', (req, res) => {
        dogstatsd.increment('operations.subtract');
        operationsController.substract(req, res)
    })
    .get('/multiply/:a/:b', (req, res) => {
        dogstatsd.increment('operations.multiply');
        operationsController.multiply(req, res)
    })
    .get('/divide/:a/:b', (req, res) => {
        dogstatsd.increment('operations.divide');
        operationsController.divide(req, res)
    })

module.exports = router;
