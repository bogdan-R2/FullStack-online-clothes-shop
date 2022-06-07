const { Router } = require("express");
const { authRouter } = require('./auth.js');
const {productsRouter} = require('./products');
const {cartRouter} = require('./cart');
const {addressesRouter} = require('./addresses');
const {orderRouter} = require('./order');

const router = Router();

router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/cart', cartRouter);
router.use('/addresses', addressesRouter);
router.use('/order', orderRouter);

module.exports = {
    router
};