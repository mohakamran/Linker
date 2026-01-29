const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    type: {
        type: String, // 'image' or 'video'
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String, // Cloudinary public ID
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, { timestamps: true });

// Auto-delete after 30 days in trash
mediaSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60, partialFilterExpression: { deletedAt: { $ne: null } } });

module.exports = mongoose.model('Media', mediaSchema);
