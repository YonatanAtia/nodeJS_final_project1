const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    birthday: String,
    marital_status: String
});

const Users = mongoose.model('User', userSchema);

module.exports = Users;
