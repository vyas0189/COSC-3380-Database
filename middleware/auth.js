const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

module.exports = {
    auth: (req, res, next) => {
        try {
            const token = req.header('jwt_token');
            if (!token) {
                return res.status(403).json({ message: 'Not Authorized' });
            }

            const payload = jwt.verify(token, JWT_SECRET);

            req.user = payload;
            return next();
        } catch (error) {
            return res.status(403).json({ message: 'Not Authorized' });
        }
    },

    doc: (req, res, next) => {
        try {
            const token = req.header('jwt_token');
            // console.log(token);
            if (!token) {
                console.log('in here');

                return res.status(403).json({ message: 'Not Authorized' });
            }

            const payload = jwt.verify(token, JWT_SECRET);

            if (payload.role === 'doctor') {
                req.user = payload;
                return next();
            }
            return res.status(403).json({ message: 'Not Authorized' });
        } catch (error) {
            return res.status(403).json({ message: 'Not Authorized' });
        }
    },
    admin: (req, res, next) => {
        try {
            const token = req.header('jwt_token');
            if (!token) {
                return res.status(403).json({ message: 'Not Authorized' });
            }

            const payload = jwt.verify(token, JWT_SECRET);
            console.log(payload);
            
            if (payload.role === 'admin') {
                req.user = payload;
                return next();
            }
            return res.status(403).json({ message: 'Not Authorized' });
        } catch (error) {
            return res.status(403).json({ message: 'Not Authorized' });
        }
    },

};
