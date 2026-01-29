const Category = require('../models/Category');
const Media = require('../models/Media');
const { v4: uuidv4 } = require('uuid');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // Simple 8-char ID: first 8 chars of a uuid (low collision risk for this scale) 
        // or use Math.random base 36
        const shareId = uuidv4().substring(0, 8);
        const category = await Category.create({
            userId: req.userId,
            name,
            shareId
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.userId, deletedAt: null }).sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Soft delete category
        const category = await Category.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Soft delete all media in this category
        await Media.updateMany(
            { categoryId: id, userId: req.userId },
            { deletedAt: new Date() }
        );

        res.status(200).json({ message: 'Category moved to trash' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { name },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};
