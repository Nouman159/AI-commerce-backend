const express = require("express");
const multer = require('multer');
const router = express.Router();

const userController = require('../Controllers/userController');
const cartController = require('../Controllers/cartController');
const { userLogout, userAuth } = require('../Middlewares/userAuth')

const path = require('path');

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });



router.post('/signup', userController.user_create);

router.post('/login', userController.user_login);

router.post('/image-generate', userAuth, userController.image_generate);

router.post('/add-to-cart', userAuth, upload.single('image'), cartController.add_to_cart);

router.get('/get-cart/:userId',
    userAuth,
    cartController.getCartByUserId);

// Handle image upload
router.post('/upload-image', upload.single('image'), (req, res) => {
    console.log('hello i am here 1')
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

router.get('/logout', userLogout);

module.exports = router;