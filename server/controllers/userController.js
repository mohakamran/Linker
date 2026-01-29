const User = require('../models/User');
const Category = require('../models/Category');
const Media = require('../models/Media');

exports.getStats = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const totalCategories = await Category.countDocuments({ userId: req.userId, deletedAt: null });
        const totalMedia = await Media.countDocuments({ userId: req.userId, deletedAt: null });

        res.status(200).json({
            storageUsed: user.storageUsed,
            totalCategories,
            totalMedia
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};
