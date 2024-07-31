const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const User = require('../Models/user')
const axios = require('axios');
const { userJwtSecret } = require('../config')
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const Replicate = require('replicate');
const { REPLICATE_API_KEY } = require('../config');
const bcrypt = require('bcrypt');


const IMAGE_DIR = path.join(__dirname, '../images'); // Adjust path to your public directory

// Ensure the image directory exists
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR);
}

const replicate = new Replicate({
    auth: REPLICATE_API_KEY,
});

exports.image_generate = [
    body('prompt')
        .notEmpty()
        .withMessage('Prompt is required.')
        .isString()
        .withMessage('Prompt must be a string.'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { prompt } = req.body;

        try {

            // const output = await replicate.run(
            //     "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
            //     {
            //         input: {
            //             width: 768,
            //             height: 768,
            //             prompt: "Extra large size shirt, straight front complete part covering 85% height and 80% width of image " + prompt + " No person, mannequin, or human elements, white background only. Front part instance only",
            //             refine: "expert_ensemble_refiner",
            //             scheduler: "K_EULER",
            //             lora_scale: 0.6,
            //             num_outputs: 1,
            //             guidance_scale: 7.5,
            //             apply_watermark: false,
            //             high_noise_frac: 0.8,
            //             negative_prompt: "Don't include persons, more than 1 shirt or more than 1 versions of a shirt",
            //             prompt_strength: 0.8,
            //             num_inference_steps: 25
            //         }
            //     }
            // );

            // const imageUrl = output[0]

            const imageUrl = 'https://files.cdn.printful.com/o/upload/variant-image/10/10189fe28c2138b039a32d0096f853f0_l';
            res.status(200).json({ filePath: imageUrl });
        } catch (error) {
            console.error('Error generating image:', error);
            res.status(500).json({ error: 'Error generating image' });
        }
    })
];

exports.user_create = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage("Username should be at least 3 characters")
        .isAlphanumeric()
        .withMessage("Username should contain only alphanumeric characters"),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ errors: [{ param: 'email', msg: 'Email already used' }] });
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            await newUser.save();
            return res.status(200).json({ message: 'success' });
        } catch (err) {
            return res.status(500).json({ message: 'Server error' });
        }
    })
];

//Login
exports.user_login = [
    body('email')
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Invalid email format.'),
    body('password').notEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ err: "User not found" });
        }
        const pwdCompare = await bcrypt.compare(req.body.password, user.password);
        if (!pwdCompare) {

            return res.status(400).json({ errors: "Incorrect credentials" });
        }
        const userToken = jwt.sign({
            data: user.id
        }, userJwtSecret, { expiresIn: '12h' });
        return res.status(200)
            .cookie("userToken", userToken, { httpOnly: true, withCredentials: true })
            .json({ user: true, "userId": user._id });
    })
]
