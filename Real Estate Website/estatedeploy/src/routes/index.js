const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Add this line
const userController = require('../controllers/userController');
const propertyController = require('../controllers/propertyController');
const tagController = require('../controllers/tagController');
const {User, Property} = require("../models"); // Import Property if needed

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Property routes
router.get('/properties', propertyController.getAllProperties);
router.get('/properties/:id', propertyController.getPropertyById);
router.post('/properties', propertyController.createProperty);
router.put('/properties/:id', propertyController.updateProperty);
router.delete('/properties/:id', propertyController.deleteProperty);
router.delete('/properties/clear', propertyController.clearAllProperties);

// Tag routes
router.get('/tags', tagController.getAllTags);
router.get('/tags/:id', tagController.getTagById);
router.post('/tags', tagController.createTag);
router.put('/tags/:id', tagController.updateTag);
router.delete('/tags/:id', tagController.deleteTag);

// Auth routes
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email },
            include: [{
                model: Property,
                as: 'properties', // Make sure this matches your association
                attributes: ['id'] // Only include property IDs
            }]
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Return user data without password
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            properties: user.properties ? user.properties.map(p => p.id) : []
        };

        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address
            // Don't include properties here - it should be managed through associations
        });

        // Return user data without password
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            properties: [] // Initialize empty array
        };

        res.status(201).json(userData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;