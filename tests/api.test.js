/**
 * Integration tests for API endpoints using supertest and Jest.
 *
 * Tests include:
 * - Retrieving team info from GET /api/about
 * - Handling empty reports for users without costs
 * - Adding costs via POST /api/add
 * - Checking user totals after adding costs
 * - Generating reports after costs are added
 * - Error handling for user not found and invalid input data
 */


const request = require('supertest');
const app = require('../app');

describe('API Endpoints Tests', () => {
    let server;

    /**
     * Start the server before running tests on port 3001 to avoid conflicts (the program's port is 3000).
     * @param {Function} done Jest callback to signal async completion
     */
    beforeAll((done) => {
        // Start the server before running tests
        server = app.listen(3001, done); // Use a different port to avoid conflict with the main server
    });

    /**
     * Close the server after all tests have finished.
     * @param {Function} done Jest callback to signal async completion
     */
    afterAll((done) => {
        // Close the server after tests finish
        server.close(done);
    });

    /**
     * Test suite for GET /api/about endpoint
     */
    describe('GET /api/about', () => {
        /**
         * Should return array of team members with correct first and last names
         */
        test('Test 1: should return team information', async () => {
            const response = await request(app)
                .get('/api/about')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('first_name', 'Idan');
            expect(response.body[0]).toHaveProperty('last_name', 'Yefet');
            expect(response.body[1]).toHaveProperty('first_name', 'Yonatan');
            expect(response.body[1]).toHaveProperty('last_name', 'Atia');
        });
    });

    /**
     * Test suite for GET /api/report before adding any costs
     */
    describe('GET /api/report - before adding costs', () => {
        /**
         * Should return 404 and error message when no report exists for user/year/month
         */

        test('Test 2: Should return 404 and error message when no report exists for user/year/month', async () => {
            const response = await request(app)
                .get('/api/report')
                .query({ id: 999999, year: 2025, month: 2 })
                .expect(404);

            expect(response.body).toHaveProperty('error', 'There are no document for the given user, year, and month');
        });
    });

    /**
     * Test suite for POST /api/add to add the first cost item
     */
    describe('POST /api/add - first cost', () => {
        /**
         * Should add a new cost item and return the saved data
         */
        test('Test 3: should add first cost item successfully', async () => {
            const costData = {
                userid: 888888,
                description: "milk",
                category: "food",
                sum: 8,
                year: 2025,
                month: 2,
                day: 12
            };

            const response = await request(app)
                .post('/api/add')
                .send(costData)
                .expect(201);


            expect(response.body).toHaveProperty('userid', 888888);
            expect(response.body).toHaveProperty('description', "milk");
            expect(response.body).toHaveProperty('category', 'food');
            expect(response.body).toHaveProperty('sum', 8);
            expect(response.body).toHaveProperty('year', 2025);
            expect(response.body).toHaveProperty('month', 2);
            expect(response.body).toHaveProperty('day', 12);
        });
    });

    /**
     * Test suite for GET /api/users/:id to verify user total after adding first cost
     */
    describe('GET /api/users/:id - after first cost', () => {
        /**
         * Should return user details with total equal to the first added cost sum
         */
        test('Test 4: should return user with correct total after first cost', async () => {
            const response = await request(app)
                .get('/api/users/888888')
                .expect(200);

            expect(response.body).toHaveProperty('id', 888888);
            expect(response.body).toHaveProperty('total', 8);
            expect(response.body).toHaveProperty('first_name');
            expect(response.body).toHaveProperty('last_name');
        });
    });

    /**
     * Test suite for POST /api/add to add a second cost item
     */
    describe('POST /api/add - second cost', () => {
        /**
         * Should add a second cost item and return saved data without day property
         */
        test('Test 5: should add second cost item successfully', async () => {
            const costData = {
                userid: 888888,
                description: "bread",
                category: "food",
                sum: 15,
                year: 2025,
                month: 2
            };

            const response = await request(app)
                .post('/api/add')
                .send(costData)
                .expect(201);

            expect(response.body).toHaveProperty('userid', 888888);
            expect(response.body).toHaveProperty('description', "bread");
            expect(response.body).toHaveProperty('category', 'food');
            expect(response.body).toHaveProperty('sum', 15);
            expect(response.body).toHaveProperty('year', 2025);
            expect(response.body).toHaveProperty('month', 2);
            expect(response.body).not.toHaveProperty('day'); //does not need to be back
        });
    });

    /**
     * Test suite for GET /api/report after adding costs
     */
    describe('GET /api/report - after adding costs', () => {
        /**
         * Should return a report with the costs data for given user/year/month
         */
        test('Test 6: should return report with added costs', async () => {
            const response = await request(app)
                .get('/api/report')
                .query({ id: 888888, year: 2025, month: 2 })
                .expect(200);

            expect(response.body).toHaveProperty('userid', 888888);
            expect(response.body).toHaveProperty('year', 2025);
            expect(response.body).toHaveProperty('month', 2);
            expect(response.body).toHaveProperty('costs');
            expect(response.body.costs).not.toEqual([]);
        });
    });

    /**
     * Test suite for GET /api/users/:id to verify final total after some costs
     */
    describe('GET /api/users/:id - final total check', () => {
        /**
         * Should return user with total equal to sum of all added costs
         */
        test('Test 7: should return user with correct final total', async () => {
            const response = await request(app)
                .get('/api/users/888888')
                .expect(200);

            expect(response.body).toHaveProperty('id', 888888);
            expect(response.body).toHaveProperty('total', 23); // 8 + 15 = 23
            expect(response.body).toHaveProperty('first_name');
            expect(response.body).toHaveProperty('last_name');
        });
    });

    /**
     * Test suite for error handlin g when user not found
     */
    describe('GET /api/users/:id - user not found', () => {
        /**
         * Should return 404 and error message for non-existent user
         */
        test('Test 8: should return 404 for non-existent user', async () => {
            const response = await request(app)
                .get('/api/users/999999999')
                .expect(404);

            expect(response.body).toHaveProperty('error', 'User not found');
        });
    });

});