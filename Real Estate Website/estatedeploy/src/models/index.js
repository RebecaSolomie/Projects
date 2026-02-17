const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define the Property model
const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bedrooms: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Define the Tag model
const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

// Define the PropertyTag model for the many-to-many relationship
const PropertyTag = sequelize.define('PropertyTag', {}, {
    timestamps: false,
});

// Relationships
User.hasMany(Property, { foreignKey: 'userId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

Property.belongsToMany(Tag, { through: PropertyTag, as: 'tags' });
Tag.belongsToMany(Property, { through: PropertyTag, as: 'properties' });

module.exports = {
    User,
    Property,
    Tag,
    PropertyTag
};
