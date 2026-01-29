const Category = require('../models/Category');
const Media = require('../models/Media');
const User = require('../models/User');
const fs = require('fs');

exports.getTrash = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.userId, deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
        const media = await Media.find({ userId: req.userId, deletedAt: { $ne: null } }).sort({ deletedAt: -1 });

        res.status(200).json({ categories, media });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trash', error: error.message });
    }
};

exports.restoreItem = async (req, res) => {
    try {
        const { type, id } = req.body; // type: 'category' or 'media'

        if (type === 'category') {
            await Category.findOneAndUpdate({ _id: id, userId: req.userId }, { deletedAt: null });
            // Restore all media in this category too? Or leave them? Usually restore implies recursive restore.
            await Media.updateMany({ categoryId: id, userId: req.userId }, { deletedAt: null });
        } else {
            await Media.findOneAndUpdate({ _id: id, userId: req.userId }, { deletedAt: null });
        }

        res.status(200).json({ message: 'Restored successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error restoring item', error: error.message });
    }
};

exports.permanentDelete = async (req, res) => {
    try {
        const { type, id } = req.params;
        const user = await User.findById(req.userId);

        if (type === 'category') {
            const category = await Category.findOneAndDelete({ _id: id, userId: req.userId });
            if (category) {
                // Delete all associated media files permanently
                const mediaFiles = await Media.find({ categoryId: id, userId: req.userId });
                let freedSpace = 0;
                for (const media of mediaFiles) {
                    if (media.publicId && fs.existsSync(media.publicId)) {
                        fs.unlinkSync(media.publicId);
                    }
                    freedSpace += media.size;
                }
                await Media.deleteMany({ categoryId: id });

                // Update storage
                if (user) {
                    user.storageUsed = Math.max(0, user.storageUsed - freedSpace);
                    await user.save();
                }
            }
        } else {
            const media = await Media.findOneAndDelete({ _id: id, userId: req.userId });
            if (media) {
                if (media.publicId && fs.existsSync(media.publicId)) {
                    fs.unlinkSync(media.publicId);
                }

                // Update storage
                if (user) {
                    user.storageUsed = Math.max(0, user.storageUsed - media.size);
                    await user.save();
                }
            }
        }
        res.status(200).json({ message: 'Permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting permanently', error: error.message });
    }
};
