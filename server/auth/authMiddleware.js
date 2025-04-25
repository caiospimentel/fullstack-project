require('dotenv').config();
const jwt = require('jsonwebtoken');
const { redisClient, connectRedis} = require('../config/redisClient');

const JWT_SECRET =  process.env.JWT_SECRET;

async function validateToken(req, res, next) {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ message: 'Missing or invalid Authorization header' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);
        
        await connectRedis();

        const tokenStatus = await redisClient.get(token);

        if (!tokenStatus) {
            return res.status(401).json({ message: 'Session expired or invalid token' });
        }

        req.user = decoded;

        next();

    } catch (err) {
        console.error('Token validation error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
}

module.exports = { validateToken };