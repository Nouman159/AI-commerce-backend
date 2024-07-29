const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongodb = require('./conn');
const multer = require('multer');
const userRoutes = require('./Routes/users');
const { PORT } = require('./config');

const app = express();

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongodb();

app.listen(PORT, () => {
    console.log(`App listening on -> port ${PORT}`);
});
