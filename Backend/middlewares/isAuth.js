import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log('Cookies received:', req.cookies);
        console.log('Token found:', !!token);
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Token not verify' });
        } 
        req.user = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid Token' });
        }
        return res.status(401).json({ message: error.message });
    }
}

export default isAuth;