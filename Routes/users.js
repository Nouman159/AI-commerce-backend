const express = require("express");
const router = express.Router();

const userController = require('../Controllers/userController');

router.post('/signup', userController.user_create);

router.post('/login', userController.user_login);

router.post('/image-generate', userController.image_generate);

module.exports = router;