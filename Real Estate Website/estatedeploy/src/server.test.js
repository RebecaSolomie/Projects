const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./server');

// Test data
const testUser = {
    name: "Test User",
    email: "test@example.com",
    phone: "123-456-7890",
    address: "123 Test St",
    password: "test123"
};

const testProperty = {
    name: "Test Property",
    location: "Test Location",
    price: "500K",
    size: "1000 sq ft",
    bedrooms: "3",
    img: "test.png",
    description: "Test description",
    tags: ["Test"]
};

// Helper function to clear test data
const clearTestData = () => {
    const dataDir = path.join(__dirname, 'data');
    const propertiesFile = path.join(dataDir, 'properties.json');
    const usersFile = path.join(dataDir, 'users.json');

    if (fs.existsSync(propertiesFile)) {
        fs.unlinkSync(propertiesFile);
    }
    if (fs.existsSync(usersFile)) {
        fs.unlinkSync(usersFile);
    }
};

describe('Server API Tests', () => {
    let userId;
    let propertyId;

    beforeAll(() => {
        clearTestData();
    });

    afterAll(() => {
        clearTestData();
    });

    describe('User Registration and Authentication', () => {
        test('POST /users - Register new user', async () => {
            const response = await request(app)
                .post('/users')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(testUser.email);
            expect(response.body).not.toHaveProperty('password');
            userId = response.body.id;
        });

        test('POST /users - Register with existing email', async () => {
            const response = await request(app)
                .post('/users')
                .send(testUser);

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email already registered');
        });

        test('POST /login - Login with valid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(testUser.email);
            expect(response.body).not.toHaveProperty('password');
        });

        test('POST /login - Login with invalid credentials', async () => {
            const response = await request(app)
                .post('/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });

    describe('Property Management', () => {
        test('POST /properties - Create new property', async () => {
            const response = await request(app)
                .post('/properties')
                .send({
                    userId,
                    ...testProperty
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(testProperty.name);
            propertyId = response.body.id;
        });

        test('POST /properties - Create property without required fields', async () => {
            const response = await request(app)
                .post('/properties')
                .send({
                    userId,
                    name: "Invalid Property"
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        test('GET /properties - Get all properties', async () => {
            const response = await request(app)
                .get('/properties');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        test('PUT /properties/:id - Update property', async () => {
            const updatedProperty = {
                ...testProperty,
                name: "Updated Property"
            };

            const response = await request(app)
                .put(`/properties/${propertyId}`)
                .send({
                    userId,
                    ...updatedProperty
                });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe("Updated Property");
        });

        test('PUT /properties/:id - Update non-existent property', async () => {
            const response = await request(app)
                .put('/properties/999999')
                .send({
                    userId,
                    ...testProperty
                });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Property not found');
        });

        test('DELETE /properties/:id - Delete property', async () => {
            const response = await request(app)
                .delete(`/properties/${propertyId}`)
                .send({ userId });

            expect(response.status).toBe(204);

            // Verify property is deleted
            const getResponse = await request(app)
                .get('/properties');
            expect(getResponse.body.find(p => p.id === propertyId)).toBeUndefined();
        });

        test('DELETE /properties/:id - Delete non-existent property', async () => {
            const response = await request(app)
                .delete('/properties/999999')
                .send({ userId });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Unauthorized');
        });
    });

    describe('User Management', () => {
        test('GET /users - Get all users', async () => {
            const response = await request(app)
                .get('/users');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).not.toHaveProperty('password');
        });
    });
});
