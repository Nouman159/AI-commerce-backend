const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    userJwtSecret: process.env.userJwtSecret,
    adminJwtSecret: process.env.adminJwtSecret,
    PORT: process.env.PORT,
    mongoURI: process.env.mongoURI,
    REPLICATE_API_KEY: process.env.REPLICATE_API_KEY

};