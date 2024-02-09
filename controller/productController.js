const Product = require('../models/productModal')

const asyncHandler = require('express-async-handler')

const CreateProduct = asyncHandler((req, res) => {
    res?.json({
        message:"Hey Its Product "
    })
})

module.exports = {CreateProduct}