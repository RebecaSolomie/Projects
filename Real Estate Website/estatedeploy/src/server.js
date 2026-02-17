const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});