const express = require("express");
const router = express.Router();

const adminController = require('../Controllers/adminController');
const { adminLogout, adminAuth } = require('../Middlewares/adminAuth')

const path = require('path');


router.post('/signup', adminController.admin_create);

router.post('/login', adminController.admin_login);

router.get('/logout', adminLogout);

module.exports = router;