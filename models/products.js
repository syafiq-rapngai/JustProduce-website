const mongoose = require('mongoose')

const ingredient = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    synopsis: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients : [ingredient],
    dimension: {
        type: String,
        required: true
    },
    storage: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: true
    },
    imageurl: {
        type: String,
        required: true
    },
    images: [String],
    price: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    fancy_name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    }
})

const Product = mongoose.model("Product", productSchema, "products")

module.exports = Product