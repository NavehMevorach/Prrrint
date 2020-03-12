const mongoose = require('mongoose')


customerSchema = new mongoose.Schema({
    full_name: {
        type: String
    },
    email: {
        type: String
    },
    country_code: {
        type: String,
        enum: {
          values: ['IL'],
          message: 'We do not provide a service to this country'
        }
    }, 
    address_line_1: String,
    admin_area_2: String,
    postal_code: String,
    photoAmount: Number,
    closingPrice: {
        type: Number,
        max: [1000, 'Max photos per order is 1000'],
        min: [30, 'Minimum photos per order is 30']
    },
    url: String
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer