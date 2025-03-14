const JWTController = require('../general/JWTController');

async function authenticateToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: "Token is required"});
    }

    try {
        const userData = await JWTController.verifyToken(token)

        if (userData instanceof Error) {
            return res.status(401).json({message: 'Your session has expired. Please sign in'});
        }

        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Expired or invalid token'});
    }
}

module.exports = authenticateToken;
