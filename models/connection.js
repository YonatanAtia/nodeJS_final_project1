const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../models/.env') }); //absolute path

//require('dotenv').config({ path: '../models/.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

// Validate environment variable
if (!uri) {
    console.error("Error: MONGO_URI environment variable is not defined");
    process.exit(1);
}

/**
 * Connects to the MongoDB Atlas database using Mongoose.
 * Handles connection success and failure scenarios with appropriate logging.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is established.
 */
async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB Atlas via Mongoose");

        // Optional: Log connection details (without sensitive info)
        console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit the process if can't connect to DB
    }
}

// Handle connection events
/**
 * Event listener for successful Mongoose connection.
 * Logs a confirmation message to the console.
 * @event mongoose:connected
 */
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB Atlas');
});

/**
 * Event listener for Mongoose connection errors.
 * Logs the error message to the console.
 *
 * @event mongoose:error
 * @param {Error} err - The connection error object.
 */
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

/**
 * Event listener for Mongoose disconnection.
 * Logs a message indicating the disconnection.
 *
 * @event mongoose:disconnected
 */
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB Atlas');
});

/**
 * Handles graceful shutdown on process termination (SIGINT).
 * Closes the MongoDB connection before exiting the process in order to avoid connections 'in the air'.
 *
 * @event process:SIGINT
 */
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during graceful shutdown:', err);
        process.exit(1);
    }
});

// Export the connection function
module.exports = connectDB;