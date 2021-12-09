var express = require('express');
var router = express.Router();
var paymentController = require('../controllers/payment.controller');
var middleware = require('../middleware');

// Data dog stats
var StatsD = require('hot-shots');
var dogstatsd = new StatsD();

router.use(middleware);

router
    .post('/', (req, res) => {
        dogstatsd.increment('payment.create')
        paymentController.create(req, res)
    })
    .post('/discount', (req, res) => {
        dogstatsd.increment('payment.discount')
        paymentController.applyDiscount(req, res)
    })
    .get('/promos', (req, res) => {
        dogstatsd.increment('payment.promos')
        paymentController.getPromos(req, res)
    });

module.exports = router;
