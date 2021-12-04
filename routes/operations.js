var express = require('express');
var router = express.Router();
var operationsController = require('../controllers/operations.controller');
var middleware = require('../middleware');

router.use(middleware);

router
    .get('/sum/:a/:b', operationsController.sum)
    .get('/subtract/:a/:b', operationsController.substract)
    .get('/multiply/:a/:b', operationsController.multiply)
    .get('/divide/:a/:b', operationsController.divide)

module.exports = router;
