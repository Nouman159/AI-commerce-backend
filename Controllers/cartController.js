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
            let cart = await CartItem.findOne({ userId, status: "added_to_cart" })

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

exports.getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find({ status: "added_to_cart" })
            .populate({
                path: 'userId',
                select: 'username email'
            });

        if (!cartItems.length) {
            return res.status(404).json({ error: 'No items with status "added_to_cart".' });
        }

        res.status(200).json({ cart: cartItems });
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: 'Error retrieving cart items' });
    }
};

exports.getAllAfterPaymentItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find({ status: "payment_done" })
            .populate({
                path: 'userId',
                select: 'username email'
            });

        if (!cartItems.length) {
            return res.status(404).json({ error: 'No items with status "payment_done".' });
        }

        res.status(200).json({ cart: cartItems });
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: 'Error retrieving cart items' });
    }
};

exports.getAllCompletedOrders = async (req, res) => {
    try {
        const cartItems = await CartItem.find({ status: "completed" })
            .populate({
                path: 'userId',
                select: 'username email'
            });

        if (!cartItems.length) {
            return res.status(404).json({ error: 'No items with status "completed".' });
        }

        res.status(200).json({ cart: cartItems });
    } catch (error) {
        console.error('Error retrieving cart items:', error);
        res.status(500).json({ error: 'Error retrieving cart items' });
    }
};

exports.getCartItemCounts = async (req, res) => {
    try {
        const addedToCartCount = await CartItem.countDocuments({ status: "added_to_cart" });
        const paymentDoneCount = await CartItem.countDocuments({ status: "payment_done" });
        const completedCount = await CartItem.countDocuments({ status: "completed" });

        res.status(200).json({
            addedToCartCount,
            paymentDoneCount,
            completedCount
        });
    } catch (error) {
        console.error('Error retrieving cart item counts:', error);
        res.status(500).json({ error: 'Error retrieving cart item counts' });
    }
};

