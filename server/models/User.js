const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    storageUsed: {
        type: Number,
        default: 0, // in bytes
    },
    isPremium: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
