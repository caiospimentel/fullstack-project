const { createClient } = require('redis');

const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    if(!redisClient.isOpen) {
        await redisClient.connect();
    }
}

module.exports = { redisClient, connectRedis };
