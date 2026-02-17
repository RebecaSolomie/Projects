const { Property, Tag, User } = require('../models/index');
const {Sequelize} = require("sequelize");

// Get all properties with filtering and sorting
exports.getAllProperties = async (req, res) => {
    try {
        const { minPrice, maxPrice, bedrooms, location, tag, sortBy, sortOrder = 'ASC' } = req.query;

        const where = {};
        const include = [];

        // Price filtering
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Sequelize.Op.gte] = minPrice;
            if (maxPrice) where.price[Sequelize.Op.lte] = maxPrice;
        }

        // Bedrooms filtering
        if (bedrooms) {
            where.bedrooms = bedrooms;
        }

        // Location filtering (case insensitive partial match)
        if (location) {
            where.location = {
                [Sequelize.Op.iLike]: `%${location}%`
            };
        }

        // Tag filtering
        if (tag) {
            include.push({
                model: Tag,
                where: { name: tag },
                through: { attributes: [] } // Don't include join table attributes
            });
        }

        // Sorting
        let order = [];
        if (sortBy) {
            order.push([sortBy, sortOrder]);
        }

        const properties = await Property.findAll({
            where,
            include: [
                ...include,
                { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
                { model: Tag, as: 'tags', through: { attributes: [] } }
            ],
            order
        });

        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single property
exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
                { model: Tag, as: 'tags', through: { attributes: [] } }
            ]
        });
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create Property
exports.createProperty = async (req, res) => {
    try {
        const { id, name, location, price, size, bedrooms, description, img, userId, tags } = req.body;

        const existingProperty = await Property.findByPk(id);
        if (existingProperty) {
            return res.status(400).json({ error: `Property with ID ${id} already exists` });
        }

        // Validate required fields
        const requiredFields = ['id', 'name', 'location', 'price', 'size', 'bedrooms', 'img', 'userId'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Create the property
        const property = await Property.create({
            id: parseInt(id),
            name,
            location,
            price: parseFloat(price),
            size: parseInt(size),
            bedrooms: parseInt(bedrooms),
            description,
            img,
            userId
        });

        // Handle tags if provided
        if (tags && tags.length) {
            const tagInstances = await Promise.all(
                tags.map(async (tagName) => {
                    const [tag] = await Tag.findOrCreate({
                        where: { name: tagName.trim() },
                        defaults: { name: tagName.trim() }
                    });
                    return tag;
                })
            );

            await property.addTags(tagInstances);
        }

        const propertyWithTags = await Property.findByPk(property.id, {
            include: [
                { model: Tag, as: 'tags', through: { attributes: [] } }
            ]
        });

        res.status(201).json(propertyWithTags);
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(400).json({ error: error.message });
    }
};

// Update property
exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        const { tags, ...propertyData } = req.body;
        await property.update(propertyData);

        if (tags) {
            const tagInstances = await Tag.findAll({
                where: { name: tags }
            });
            await property.setTags(tagInstances);
        }

        const updatedProperty = await Property.findByPk(property.id, {
            include: [
                { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
                { model: Tag, as: 'tags', through: { attributes: [] } }
            ]
        });

        res.json(updatedProperty);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        await property.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear all properties
exports.clearAllProperties = async (req, res) => {
    try {
        await Property.destroy({
            where: {},
            truncate: true // This resets auto-increment counters
        });

        res.status(200).json({ message: 'All properties cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};