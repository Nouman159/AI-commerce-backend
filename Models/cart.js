const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            finalImage: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true },
        }
    ],
    status: {
        type: String,
        default: 'added_to_cart'
    },
    createdAt: { type: Date, default: Date.now }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
