const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('estate-db', 'postgres', 'Itdo96:1608', {
    host: 'estate-db.cfa0y280aw1s.eu-north-1.rds.amazonaws.com',
    port: 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = { sequelize }; 