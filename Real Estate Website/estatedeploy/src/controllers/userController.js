const { User } = require('../models/index');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: ['properties'],
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: ['properties'],
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create user
exports.createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        await user.update(req.body);
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};