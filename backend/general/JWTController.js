require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

class JWTController {
    static generateToken(user) {
        const { email, fullname } = user;
        return jwt.sign({ email, fullname, userId: user._id }, SECRET_KEY, { expiresIn: '7d' });
    }

    static async verifyToken(token) {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return error;
        }
    }
}

module.exports = JWTController;
