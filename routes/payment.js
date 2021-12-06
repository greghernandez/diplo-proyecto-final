var express = require('express');
var router = express.Router();
var paymentController = require('../controllers/payment.controller');
var middleware = require('../middleware');


router.use(middleware);

router
    .post('/', paymentController.create)
    .post('/discount', paymentController.applyDiscount)
    .get('/promos', paymentController.getPromos);

module.exports = router;
