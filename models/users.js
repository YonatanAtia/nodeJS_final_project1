const mongoose = require('mongoose');

/**
 * Mongoose schema for a user entry.
 *
 * @typedef {Object} User
 * @property {number} id - Unique user identifier.
 * @property {string} first_name - User's first name (default: "def_first_name").
 * @property {string} last_name - User's last name (default: "def_last_name").
 * @property {string} birthday - User's birthday (expected in a string format, e.g., "YYYY-MM-DD").
 * @property {string} marital_status - User's marital status (e.g., "single", "married").
 * @property {number} total - Total amount or value associated with the user.
 */
const userSchema = new mongoose.Schema({
    id: Number,
    first_name: { type: String, default: "def_first_name" },
    last_name: { type: String, default: "def_last_name" },
    birthday: String,
    marital_status: String,
    total: Number
});

/**
 * Mongoose model for interacting with the 'users' collection in MongoDB.
 *
 * @type {mongoose.Model<User>}
 */

const Users = mongoose.model('User', userSchema);

module.exports = Users;
