const SHIPMENT_FILE_PATH = 'shipment-generated.txt';
const faker = require('faker');
const fs = require('fs');
const LINE_ENDING = require('os').EOL;

module.exports = {
    getAllShipments: function (req, res) {
        // Get all shipments from the file
        fs.readFile(SHIPMENT_FILE_PATH, 'utf8', function (err, data) {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            }
            // Split the file into an array of shipments
            const formatedData = []
            data.split(LINE_ENDING).forEach(element => {
                if (element) {
                    formatedData.push(JSON.parse(element));
                }
            })

            // Send the response
            res.status(200).send({
                data: formatedData
            });
        });
    },

    getById: function (req, res) {
        // Shipment id
        const id = req.params.id;

        // Get all shipments from the file
        fs.readFile(SHIPMENT_FILE_PATH, 'utf8', function (err, data) {
            if (err) {
                res.status(500).send(err);
            }
            // Split the file into an array of shipments
            const formatedData = []
            data.split(LINE_ENDING).forEach(element => {
                if (element) {
                    formatedData.push(JSON.parse(element));
                }
            })
        
            // Find the shipment with the given id
            const shipment = formatedData.find(shipment => shipment.id === id);


            if (shipment) {
                // Send the response
                res.status(200).send({
                    data: shipment
                });
            } else {
                // Send the response
                res.status(204).send({
                    message: 'Shipment not found'
                });
            }
        });

    },

    createShipment: function (req, res) {
        // create a new shipment
        let shipment = {
            id: faker.datatype.uuid(),
            address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.country()}`,
            price: faker.commerce.price(),
            user: {
                name: faker.name.findName(),
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber('(###) ###-####')
            },
            status: 'pending'
        };

        // write the shipment to the file
        const fd = fs.openSync(SHIPMENT_FILE_PATH, 'a');
        fs.appendFile(fd, JSON.stringify(shipment) + LINE_ENDING, 'utf8', () => {
            fs.close(fd, () => {
                res.status(201).send({
                    message: 'Shipment created successfully',
                    data: shipment
                });
            });
        })
    },

    changeStatus: function (req, res) {
        //Debera de retornar una dirección random
        // codigo de respuesta 201
        // data la direcciòn random

        // Get the shipment id
        const shipmentId = req.params.id;

        // Get status from the request
        const status = req.body.status;

        if (!status) res.status(204).send({ message: 'Status is required' });

        // Read the file
        const fd = fs.openSync(SHIPMENT_FILE_PATH, 'r');
        let fileContent = fs.readFileSync(fd, 'utf8');
        let shipments = fileContent.split(LINE_ENDING);
        shipments.pop();

        // Shipment data
        let shipment = null;
        let shipmentIndex = null
        

        // Find the shipment
        shipments.forEach((element, index) => {
            if (element) {
                if (JSON.parse(element).id === shipmentId) {
                    shipment = JSON.parse(element);
                    shipmentIndex = index;
                }
            }
        })

        // Change the status and update the file
        if (shipment) {
            shipment.status = status;
            // Update the file content with the new shipment data
            shipments[shipmentIndex] = JSON.stringify(shipment);

            // Convert the array to strin json to write it to the file
            const newFileContent = shipments.filter(element => {
                return `${JSON.stringify(element)}`
            }).join(LINE_ENDING);

            // Update the file line
            const fd2 = fs.openSync(SHIPMENT_FILE_PATH, 'w');
            fs.writeFile(fd2, newFileContent + LINE_ENDING, 'utf8', () => {
                fs.close(fd2, () => {
                    res.status(201).send({
                        message: 'Shipment updated successfully',
                        data: shipment
                    });
                });
            })
        } else {
            res.status(204).send({
                message: 'Shipment not found'
            });
        }
    },
};
