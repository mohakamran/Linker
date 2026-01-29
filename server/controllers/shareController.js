const Category = require('../models/Category');
const Media = require('../models/Media');
const User = require('../models/User');

exports.getSharedCategory = async (req, res) => {
    try {
        const { shareId } = req.params;
        const category = await Category.findOne({ shareId });
        if (!category) return res.status(404).json({ message: 'Category not found or link is invalid' });

        const owner = await User.findById(category.userId).select('name');
        const media = await Media.find({ categoryId: category._id }).sort({ createdAt: -1 });

        res.status(200).json({
            category: {
                name: category.name,
                createdAt: category.createdAt,
                ownerName: owner ? owner.name : 'Unknown',
                media
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error loading shared content', error: error.message });
    }
};
