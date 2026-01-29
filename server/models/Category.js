const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    shareId: {
        type: String,
        required: true,
        unique: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

// Auto-delete after 30 days in trash
categorySchema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60, partialFilterExpression: { deletedAt: { $ne: null } } });

module.exports = mongoose.model('Category', categorySchema);
