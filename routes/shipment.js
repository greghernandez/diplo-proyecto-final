var express = require('express');
var router = express.Router();
var shipmentController = require('../controllers/shipment.controller');
var middleware = require('../middleware');

// Data dog stats
var StatsD = require('hot-shots');
var dogstatsd = new StatsD();

router.use(middleware);

router
    .get('/', (req, res) => {
        dogstatsd.increment('shipment.get');
        shipmentController.getAllShipments(req, res)
    })
    .get('/:id', (req, res) => {
        dogstatsd.increment('shipment.get.id');
        shipmentController.getById(req, res)
    })
    .post('/', (req, res) => {
        dogstatsd.increment('shipment.create');
        shipmentController.createShipment(req, res)
    })
    .patch('/:id', (req, res) => {
        dogstatsd.increment('shipment.update');
        shipmentController.changeStatus(req, res)
    })

module.exports = router;
