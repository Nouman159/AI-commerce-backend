const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});
adminSchema.index({ firstname: 1 }, { unique: false });

module.exports = mongoose.model('Admin', adminSchema);