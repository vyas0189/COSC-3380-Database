const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

module.exports = {
    isLoggedIn: (req) => !!req.user.userID,
    isDoctor: (req) => {

    },
    isAdmin: (req) => {

    },
};
