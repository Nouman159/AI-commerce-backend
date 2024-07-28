const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mongodb = require('./conn');
const userRoutes = require('./Routes/users');
const { PORT } = require('./config');

const app = express();

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve the images directory statically
const IMAGE_DIR = path.join(__dirname, '/images');
app.use('/images', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // or specify your domain
    next();
});
// app.use('/images', createProxyMiddleware({
//     target: 'http://your-image-server.com',
//     changeOrigin: true,
//     onProxyRes: (proxyRes) => {
//       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
//     }
//   }));
app.use('/images', express.static(IMAGE_DIR));

// Routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

mongodb();

app.listen(PORT, () => {
    console.log(`App listening on -> port ${PORT}`);
});
