module.exports = {
    sum: function (req, res) {
        // Get the numbers from the request
        const {a, b} = req.params
        // Calculate the sum
        const result = Number(a) + Number(b)

        // Return the result
        if (isNaN(result)) {
            res.status(400).send({
                error: 'Invalid parameters'
            })
        } else {
            res.status(200).send({
                result
            })
        }
    },

    substract: function (req, res) {
        // Get the numbers from the request
        const {a, b} = req.params
        // Calculate the substraction
        const result = Number(a) - Number(b)

        // Return the result
        if (isNaN(result)) {
            res.status(400).send({
                error: 'Invalid parameters'
            })
        } else {
            res.status(200).send({
                result
            })
        }
    },

    multiply: function (req, res) {
        // Get the numbers from the request
        const {a, b} = req.params
        // Calculate the multiplication
        const result = Number(a) * Number(b)

        // Return the result
        if (isNaN(result)) {
            res.status(400).send({
                error: 'Invalid parameters'
            })
        } else {
            res.status(200).send({
                result
            })
        }
    },

    divide: function (req, res) {
        // Get the numbers from the request
        const {a, b } = req.params

        if (Number(b) === 0) {
            res.status(400).send({
                error: 'Cannot divide by zero'
            })
        } else {
            // Calculate the division
            const result = Number(a) / Number(b)

            // Return the result
            if (isNaN(result)) {
                res.status(400).send({
                    error: 'Invalid parameters'
                })
            } else {
                res.status(200).send({
                    result
                })
            }
        }
    }
};
