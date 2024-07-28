const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { mongoURI } = require('./config');

const mongodb = async () => {
    try {
        const connection = await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
        return connection;
    } catch (err) {
        console.log('Connection unsuccessful : ' + err);
        throw err;
    }
}

module.exports = mongodb;
