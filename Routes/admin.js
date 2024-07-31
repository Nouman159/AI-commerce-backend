const express = require("express");
const router = express.Router();

const adminController = require('../Controllers/adminController');
const cartController = require('../Controllers/cartController');
const { adminLogout, adminAuth } = require('../Middlewares/adminAuth')

const path = require('path');


router.post('/signup', adminController.admin_create);

router.post('/login', adminController.admin_login);

router.get('/get-cart-items', adminAuth, cartController.getAllCartItems);

router.get('/get-pending-orders', adminAuth, cartController.getAllAfterPaymentItems);

router.get('/get-completed-orders', adminAuth, cartController.getAllCompletedOrders);

router.get('/get-orders-count', adminAuth, cartController.getCartItemCounts);

router.get('/logout', adminLogout);

module.exports = router;