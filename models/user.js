const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/app';

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number
});

module.exports = mongoose.model('User', userSchema);

