const jwt = require('jsonwebtoken');

const { userJwtSecret } = require('../config');

const userAuth = (req, res, next) => {
    console.log(req)
    const token = req.cookies.userToken;
    if (!token) {
        return res.status(401).json({ access: 'false', message: 'Authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, userJwtSecret);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ access: 'false', message: 'Invalid token' });
    }
};


const userLogout = (req, res) => {
    const token = req.cookies.userToken;
    if (!token) {
        return res.status(200).json({ isLogout: true });
    }
    try {
        const decoded = jwt.verify(token, userJwtSecret);
        req.user = decoded;
        res.clearCookie("userToken");
        return res.status(200).json({ isLogout: true });
    }
    catch (er) {
        console.log("err", er);
        return res.status(401).json({ isLogout: false });
    }
};

module.exports = {
    userAuth,
    userLogout
}