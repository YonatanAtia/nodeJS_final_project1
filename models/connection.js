const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../models/.env') }); //absolute path

//require('dotenv').config({ path: '../models/.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

// Validate environment variable
if (!uri) {
    console.error("❌ Error: MONGO_URI environment variable is not defined");
    process.exit(1);
}

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB Atlas via Mongoose");

        // Optional: Log connection details (without sensitive info)
        console.log(`🌐 Connected to database: ${mongoose.connection.db.databaseName}`);

    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // Exit the process if can't connect to DB
    }
}

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from MongoDB Atlas');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('🛑 MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during graceful shutdown:', err);
        process.exit(1);
    }
});

// Export the connection function
module.exports = connectDB;