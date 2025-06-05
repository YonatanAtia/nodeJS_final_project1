const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

require('dotenv').config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/add', () => {
    it('should add a new cost item', async () => {
        const response = await request(app)
            .post('/api/add')
            .send({
                description: "Test purchase",
                category: "food",
                userid: 123123,
                sum: 42
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('description', 'Test purchase');
        expect(response.body).toHaveProperty('category', 'food');
        expect(response.body).toHaveProperty('userid', 123123);
    });
});

describe('GET /api/report', () => {
    it('should return monthly report for user', async () => {
        const response = await request(app)
            .get('/api/report?id=123123&year=2025&month=6');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('userid', 123123);
        expect(response.body).toHaveProperty('year', 2025);
        expect(response.body).toHaveProperty('month', 6);
        expect(response.body).toHaveProperty('costs');
        expect(Array.isArray(response.body.costs)).toBe(true);
    });
});

describe('GET /api/users/:id', () => {
    it('should return user details and total cost', async () => {
        const response = await request(app).get('/api/users/123123');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 123123);
        expect(response.body).toHaveProperty('first_name');
        expect(response.body).toHaveProperty('last_name');
        expect(response.body).toHaveProperty('total');
    });
});

describe('GET /api/about', () => {
    it('should return an array of team members', async () => {
        const response = await request(app).get('/api/about');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty('first_name');
            expect(response.body[0]).toHaveProperty('last_name');
        }
    });
});
