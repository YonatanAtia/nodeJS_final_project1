const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./models/connection');
const User = require('./models/users');
const Cost = require('./models/costs');

async function seedDatabase() {
    try {
        await connectDB();

        const user = {
            id: 123123,
            first_name: "Idan",
            last_name: "Yefet",
            birthday: "1999-11-07",
            marital_status: "single"
        };


        const costs = [
            { description: "Pizza", category: "food", userid: 123123, sum: 20, year: 2025, month: 6, day: 1 },
            { description: "Math book", category: "education", userid: 123123, sum: 50, year: 2025, month: 6, day: 2 },
            { description: "Gym membership", category: "sport", userid: 123123, sum: 80, year: 2025, month: 6, day: 3 }
        ];

        await User.deleteMany({ id: 123123 });
        await Cost.deleteMany({ userid: 123123 });

        await User.create(user);
        await Cost.insertMany(costs);

        console.log('✅ Test user and costs inserted');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();
