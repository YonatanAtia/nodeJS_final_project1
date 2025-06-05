const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    description: String,
    category: String,
    userid: Number,
    sum: Number,
    year: { type: Number, default: () => new Date().getFullYear() },
    month: { type: Number, default: () => new Date().getMonth() + 1 }, //between 0-11, so need to add 1
    day: { type: Number, default: () => new Date().getDate() }
});

const Costs = mongoose.model('Cost', costSchema);

module.exports = Costs;
