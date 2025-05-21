require('dotenv').config();
const jwt = require('jsonwebtoken');
const { redisClient, connectRedis } = require('../config/redisClient');

const JWT_SECRET =  process.env.JWT_SECRET;

async function validateAuth(req, res){
    const {keyword} = req.body;

    if(!keyword){
        return res.status(400).json({message: 'Keyword is required'});
    }

    if (keyword !== process.env.AUTH_SECRET_KEYWORD){
        return res.status(401).json({message: 'Invalid keyword'});
    }

    const token = jwt.sign(
        {role: 'admin'},
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h'}
    )

    try{

        await redisClient.set(token, 'valid', {
            EX: 60 * 60, // expires in 1 hour
          });

        return res.status(200).json({token});

    }catch(err) {
        console.error('Redis Error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}

async function logoutUser(req, res) {
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        await redisClient.del(token);

        return res.status(200).json({ message: 'Logged out successfully'})
    }catch(err){
        console.error('Logout error:', err.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }


module.exports = {
    validateAuth,
    logoutUser,
};