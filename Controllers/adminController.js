const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");
const Admin = require('../Models/admin')
const { adminJwtSecret } = require('../config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.admin_create = [
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
        const admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            return res.status(400).json({ errors: [{ param: 'email', msg: 'Email already used' }] });
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newAdmin = new Admin({
                email: req.body.email,
                password: hashedPassword
            });
            await newAdmin.save();
            return res.status(200).json({ message: 'success' });
        } catch (err) {
            return res.status(500).json({ message: 'Server error' });
        }
    })
];

exports.admin_login = [
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
        const admin = await Admin.findOne({ email: req.body.email })
        if (!admin) {
            return res.status(400).json({ err: "Admin not found" });
        }
        const pwdCompare = await bcrypt.compare(req.body.password, admin.password);
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Incorrect credentials" });
        }
        const adminToken = jwt.sign({
            data: admin.id
        }, adminJwtSecret, { expiresIn: '12h' });
        return res.status(200)
            .cookie("adminToken", adminToken, { httpOnly: true, withCredentials: true })
            .json({ admin: true, "adminId": admin._id });
    })
]
