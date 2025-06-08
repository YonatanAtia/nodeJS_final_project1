const mongoose = require('mongoose');

/**
 * Mongoose schema for a cost (expense) entry.
 *
 * @typedef {Object} Cost
 * @property {string} description - Description of the expense.
 * @property {string} category - Category of the expense (e.g., food, education).
 * @property {number} userid - ID of the user associated with the expense.
 * @property {number} sum - Amount of the expense.
 * @property {number} year - Year of the expense (default: current year).
 * @property {number} month - Month of the expense, 1-based (default: current month).
 * @property {number} day - Day of the expense (default: current day).
 */
const costSchema = new mongoose.Schema({
    description: String,
    category: String,
    userid: Number,
    sum: Number,
    year: { type: Number, default: () => new Date().getFullYear() },
    month: { type: Number, default: () => new Date().getMonth() + 1 }, //between 0-11, so need to add 1
    day: { type: Number, default: () => new Date().getDate() }
});

/**
 * Mongoose model for interacting with the 'costs' collection in MongoDB.
 *
 * @type {mongoose.Model<Cost>}
 */
const Costs = mongoose.model('Cost', costSchema);

//Export the cost model
module.exports = Costs;
