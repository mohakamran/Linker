const Media = require('../models/Media');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.uploadMedia = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const { categoryId } = req.body;

        // Check Storage Limit
        const user = await User.findById(req.userId);
        const fileSize = req.file.size;
        const STORAGE_LIMIT = 1024 * 1024 * 1024; // 1GB

        if (user.storageUsed + fileSize > STORAGE_LIMIT) {
            return res.status(402).json({
                message: 'Storage full (1GB limit reached). Pay $0.25 to upload this file.',
                requiresPayment: true,
                cost: 0.25
            });
        }

        // Determine resource type based on mimetype
        const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

        // Construct local URL (assuming server runs on localhost:5000)
        // In production, you'd use process.env.SERVER_URL
        const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
        const fileUrl = `${serverUrl}/uploads/${req.file.filename}`;

        // Save to DB
        const media = await Media.create({
            userId: req.userId,
            categoryId,
            type: resourceType,
            url: fileUrl,
            publicId: req.file.path, // Store local path as "publicId" for easy deletion
            name: req.file.originalname,
            size: req.file.size
        });

        // Update User Storage
        user.storageUsed += fileSize;
        await user.save();

        res.status(201).json(media);
    } catch (error) {
        console.error('Upload Error:', error);
        // Clean up file if DB save fails
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete orphaned file:", err);
            });
        }
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

exports.getMediaByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const media = await Media.find({ categoryId, userId: req.userId, deletedAt: null }).sort({ createdAt: -1 });
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching media', error: error.message });
    }
};

exports.deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { deletedAt: new Date() },
            { new: true }
        );
        if (!media) return res.status(404).json({ message: 'Media not found' });

        // Do NOT delete file from disk yet. Only on permanent delete.

        res.status(200).json({ message: 'Media moved to trash. Will be deleted in 30 days.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting media', error: error.message });
    }
};
