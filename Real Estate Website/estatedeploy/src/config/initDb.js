const { User, Property, Tag } = require('../models/index');
const bcrypt = require('bcrypt');
const { sequelize } = require("./database");

// Sample data for users and properties
const usersData = [
    {
        name: "Amanda Hill",
        phone: "123-456-7890",
        address: "86 Oak Ave, London, UK",
        email: "amanda.hill@gmail.com",
        password: "amanda123", // You'll want to hash the password in real apps
        properties: [1, 3, 8, 9, 12]
    },
    {
        name: "Jerry Johnson",
        phone: "234-567-8901",
        address: "45 Maple St, New York, USA",
        email: "jerry_jj12@yahoo.com",
        password: "jerry12",
        properties: [2, 4, 10]
    },
    {   name: "John Doe",
        phone: "345-678-9012",
        address: "78 Pine Rd, Los Angeles, USA",
        email: "john.doe@gmail.com",
        password: "johniedoe",
        properties: [5, 6, 11]
    },
    {
        name: "Jane Smith",
        phone: "456-789-0123",
        address: "12 Elm St, Toronto, Canada",
        email: "jane.smith@example.com",
        password: "smithjjanne",
        properties: []
    },
    {
        name: "Michael Brown",
        phone: "567-890-1234",
        address: "34 Birch Ln, Sydney, Australia",
        email: "michael.brown@example.com",
        password: "michaeltheone",
        properties: [7]
    }
];

const propertiesData = [
    {
        id: 1,
        name: "Lodha Miracle",
        location: "East Essex, UK",
        price: "850K",
        size: "750 sq ft",
        bedrooms: "3",
        img: "house1.png",
        description: "A beautiful modern home in the heart of East Essex, featuring a private garden.",
        tags: ["Modern", "Garden"]
    },
    {
        id: 2,
        name: "Lake Villa",
        location: "Lake Zurich South, Switzerland",
        price: "1.8M",
        size: "2000 sq ft",
        bedrooms: "5",
        img: "house2.png",
        description: "A spacious villa with stunning lake views and a private pool.",
        tags: ["Spacious", "Water View", "Pool"]
    },
    {
        id: 3,
        name: "Palm Residence",
        location: "Palm Jumeirah, Dubai",
        price: "3.5M",
        size: "4000 sq ft",
        bedrooms: "6",
        img: "house3.png",
        description: "A luxurious and modern residence with breathtaking sea views. Located in the prestigious Palm Jumeirah, this property offers unparalleled luxury with its spacious layout, state-of-the-art facilities, and exquisite finishes. Perfect for those seeking an opulent lifestyle in one of Dubai's most sought-after locations.",
        tags: ["Modern", "Water View"]
    },
    {
        id: 4,
        name: "Villa Leopolda",
        location: "Cote D'Azur, France",
        price: "5M",
        size: "5000 sq ft",
        bedrooms: "8",
        img: "house4.png",
        description: "A historical villa with expansive gardens and a private pool. This magnificent property combines classic architecture with modern comforts, offering a unique living experience. The lush gardens and outdoor spaces provide a tranquil retreat, while the interiors are adorned with elegant details and luxurious amenities.",
        tags: ["Historical", "Garden", "Pool"]
    },
    {
        id: 5,
        name: "The Pinnacle",
        location: "Montana, USA",
        price: "2.5M",
        size: "3000 sq ft",
        bedrooms: "4",
        img: "house5.png",
        description: "A spacious mountain retreat with modern amenities and stunning views. Nestled in the picturesque mountains of Montana, this property offers a perfect escape from the hustle and bustle of city life. The interiors are designed for comfort and style, with large windows that frame the breathtaking natural surroundings.",
        tags: ["Modern", "Mountain"]
    },
    {
        id: 6,
        name: "Villa La Palladiana",
        location: "Veneto, Italy",
        price: "4M",
        size: "3500 sq ft",
        bedrooms: "7",
        img: "house6.png",
        description: "A historical villa with classical architecture and modern comforts. This exquisite property is a testament to timeless elegance, featuring beautifully preserved architectural details and luxurious modern amenities. The spacious interiors and serene outdoor spaces make it an ideal home for those who appreciate both history and contemporary living.",
        tags: ["Historical"]
    },
    {
        id: 7,
        name: "The One",
        location: "Bel Air, USA",
        price: "3M",
        size: "3200 sq ft",
        bedrooms: "5",
        img: "house7.png",
        description: "A modern and luxurious home with a private pool and spacious interiors. Located in the exclusive neighborhood of Bel Air, this property offers the ultimate in luxury living. The open-plan design and high-end finishes create a sophisticated and comfortable environment, perfect for entertaining or relaxing in style.",
        tags: ["Modern", "Spacious", "Pool"]
    },
    {
        id: 8,
        name: "Villa Alang Alang",
        location: "Bali, Indonesia",
        price: "2.2M",
        size: "2700 sq ft",
        bedrooms: "4",
        img: "house8.png",
        description: "A tropical paradise with modern amenities and a private pool. This stunning villa is set in the lush landscapes of Bali, offering a serene and luxurious living experience. The property features spacious living areas, beautiful outdoor spaces, and top-of-the-line amenities, making it a perfect retreat for those seeking tranquility and comfort.",
        tags: ["Modern", "Pool"]
    },
    {
        id: 9,
        name: "Flower Villa",
        location: "Sicily, Italy",
        price: "820K",
        size: "800 sq ft",
        bedrooms: "3",
        img: "house9.png",
        description: "A modern home with spacious interiors and a beautiful garden. This charming property combines contemporary design with a cozy atmosphere, offering a perfect living space for families. The well-maintained garden provides a lovely outdoor area for relaxation and entertainment, while the interiors are designed for comfort and style.",
        tags: ["Historical", "Spacious", "Garden"]
    },
    {
        id: 10,
        name: "Prestige Apartment",
        location: "Central London, UK",
        price: "935K",
        size: "750 sq ft",
        bedrooms: "2",
        img: "house10.png",
        description: "A modern apartment in the heart of London with luxurious finishes. This elegant property offers a sophisticated urban living experience, with high-end amenities and stylish interiors. Located in a prime location, it provides easy access to the best that London has to offer, making it an ideal home for city dwellers.",
        tags: ["Modern"]
    },
    {
        id: 11,
        name: "Eden Apartment",
        location: "Eden Island, Seychelles",
        price: "1.2M",
        size: "1000 sq ft",
        bedrooms: "3",
        img: "house11.png",
        description: "A modern apartment with stunning sea views and luxurious amenities. This beautiful property is located in the exclusive Eden Island, offering a serene and opulent living experience. The spacious interiors and breathtaking views make it a perfect home for those seeking luxury and tranquility in a tropical paradise.",
        tags: ["Modern", "Water View"]
    },
    {
        id: 12,
        name: "Sky Villa",
        location: "Dubai Marina, Dubai",
        price: "2.5M",
        size: "2000 sq ft",
        bedrooms: "4",
        img: "house12.png",
        description: "A luxurious villa with modern design and breathtaking marina views. This stunning property is located in the prestigious Dubai Marina, offering a perfect blend of luxury and comfort. The spacious interiors and high-end finishes create a sophisticated living environment, while the beautiful views provide a serene backdrop for everyday life.",
        tags: ["Modern", "Water View"]
    }
];

const tagsData = ["Modern", "Garden", "Spacious", "Water View", "Pool", "Historical"];

// Initialization function to seed the data
async function initDb(forceSync = false) {
    try {
        if (forceSync) {
            console.log('⚠️  WARNING: This will DROP ALL TABLES and recreate them!');
            console.log('⚠️  Make sure you are in development environment!');
            
            // Add a 5-second delay to give time to cancel if needed
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            await sequelize.sync({ force: true });
            console.log('✅ Database tables have been recreated');
        } else {
            // Safe sync - only creates tables if they don't exist
            await sequelize.sync();
            console.log('✅ Database tables are up to date');
        }

        // Check if we already have data
        const userCount = await User.count();
        if (userCount > 0) {
            console.log('⚠️  Database already contains data. Skipping seed data.');
            return;
        }

        console.log('🌱 Starting to seed data...');

        // Add tags
        const tags = await Promise.all(tagsData.map(tag => Tag.create({ name: tag })));
        console.log('✅ Tags created');

        // Add users with properties
        for (const userData of usersData) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await User.create({
                name: userData.name,
                phone: userData.phone,
                address: userData.address,
                email: userData.email,
                password: hashedPassword
            });

            // Add properties for each user
            for (const propertyId of userData.properties) {
                const propertyData = propertiesData.find(p => p.id === propertyId);
                if (propertyData) {
                    const property = await Property.create({
                        name: propertyData.name,
                        location: propertyData.location,
                        price: propertyData.price,
                        size: propertyData.size,
                        bedrooms: propertyData.bedrooms,
                        img: propertyData.img,
                        description: propertyData.description,
                        userId: user.id
                    });

                    // Add tags to property
                    if (propertyData.tags) {
                        const propertyTags = await Tag.findAll({
                            where: {
                                name: propertyData.tags
                            }
                        });
                        await property.setTags(propertyTags);
                    }
                }
            }
        }
        console.log('✅ Users and their properties created');

        // Reset the sequence for Properties table
        await sequelize.query(`SELECT setval(pg_get_serial_sequence('"Properties"', 'id'), COALESCE(MAX(id), 1), false) FROM "Properties";`);
        console.log('✅ Property sequence reset');

        console.log('✅ Database initialization completed successfully!');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
}

// Only run if this file is being run directly
if (require.main === module) {
    const forceSync = process.argv.includes('--force');
    initDb(forceSync)
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Failed to initialize database:', error);
            process.exit(1);
        });
}

module.exports = initDb;

