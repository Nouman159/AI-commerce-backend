const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const CartItem = require('../Models/cart'); // Adjust the path as necessary

exports.add_to_cart = [
    body('userId')
        .notEmpty()
        .withMessage('User ID is required.')
        .isString()
        .withMessage('User ID must be a string.')
        .isMongoId()
        .withMessage('Invalid User ID format.'),
    body('finalImage')
        .notEmpty()
        .withMessage('Image is required.')
        .isString()
        .withMessage('Image must be a string.'),
    body('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number.'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, finalImage, quantity, price } = req.body;

        try {
            let cart = await CartItem.findOne({ userId });

            if (!cart) {
                cart = new CartItem({ userId, items: [] });
            }

            cart.items.push({ finalImage, quantity, price });
            await cart.save();

            res.status(200).json(cart);
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ error: 'Error adding to cart' });
        }
    })
];

exports.getCartByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const cart = await CartItem.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found for this user.' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ error: 'Error retrieving cart' });
    }
};
