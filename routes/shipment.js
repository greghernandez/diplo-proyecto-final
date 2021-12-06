var express = require('express');
var router = express.Router();
var shipmentController = require('../controllers/shipment.controller');
var middleware = require('../middleware');



router.use(middleware);

router
    .get('/', shipmentController.getAllShipments)
    .get('/:id', shipmentController.getById)
    .post('/', shipmentController.createShipment)
    .patch('/:id', shipmentController.changeStatus)

module.exports = router;
