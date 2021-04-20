const mongoose = require('mongoose')

const subscriberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const Subscriber = mongoose.model("Subscriber", subscriberSchema, "subscribers")

module.exports = Subscriber