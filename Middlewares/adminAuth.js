const jwt = require('jsonwebtoken');

const { adminJwtSecret } = require('../config');

const adminAuth = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.status(401).json({ access: 'false', message: 'Authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, adminJwtSecret);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ access: 'false', message: 'Invalid token' });
    }
};


const adminLogout = (req, res) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.status(200).json({ isLogout: true });
    }
    try {
        const decoded = jwt.verify(token, adminJwtSecret);
        req.user = decoded;
        res.clearCookie("adminToken");
        return res.status(200).json({ isLogout: true });
    }
    catch (er) {
        console.log("err", er);
        return res.status(401).json({ isLogout: false });
    }
};

module.exports = {
    adminAuth,
    adminLogout
}