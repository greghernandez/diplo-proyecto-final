const PAYMENT_FILE_PATH = 'payment-generated.txt';
const faker = require('faker');
const fs = require('fs');
const LINE_ENDING = require('os').EOL;

module.exports = {
    create: function (req, res) {
        try {
            const fd = fs.openSync(PAYMENT_FILE_PATH, 'a');
            const price = faker.commerce.price();
            fs.appendFile(fd, price + LINE_ENDING, 'utf8', () => {
                fs.close(fd, () => {
                    res.status(201).send({
                        data: price
                    });
                });
            })
        } catch (e) {
            res.status(500).send({
                error: e.message
            });
            throw new Error("Something went wrong with the create payment");
        }
    },

    applyDiscount: function (req, res) {
        //debera de restar una cantidad a cada precio en payment-generated.txt
        // Get the discount amount
        const discountAmount = req.body.discountAmount;

        if (!discountAmount) {
            return res.status(400).send({
                message: 'discountAmount is required'
            });
        }

        // Get prices list from file
        fs.readFile(PAYMENT_FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                res.status(500).send({
                    error: err.message
                });
                throw new Error(err.message);
            } else if (data) {
                const prices = data.split(LINE_ENDING).filter(price => price);
                // Apply discount to each price
                const discountedPrices = prices.map(price => {
                    return price - discountAmount;
                });
                // Write new prices to file
                fs.writeFile(PAYMENT_FILE_PATH, discountedPrices.join(LINE_ENDING), 'utf8', (err) => {
                    if (err) {
                        res.status(500).send({
                            error: err.message
                        });
                        throw new Error(err.message);
                    } else {
                        res.status(200).send({
                            data: discountedPrices
                        });
                    }
                });
            }
        })
    },

    getPromos: function (req, res) {
        res.json([
            {name: "BUENFIN"},
            {name: "HOTSALE"},
            {name: "CYBERMONDAY"},
            {name: "BLACKFRIDAY"},
            {name: "PRIMEDAY"},
        ]);
    }
};
