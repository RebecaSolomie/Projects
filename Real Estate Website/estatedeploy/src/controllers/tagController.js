const { Tag, Property } = require('../models/index');

// Get all tags
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({
            include: [{ model: Property, as: 'properties', through: { attributes: [] } }]
        });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single tag
exports.getTagById = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id, {
            include: [{ model: Property, as: 'properties', through: { attributes: [] } }]
        });
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json(tag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create tag
exports.createTag = async (req, res) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update tag
exports.updateTag = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        await tag.update(req.body);
        res.json(tag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete tag
exports.deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        await tag.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};