const { connectRedis, redisClient } = require('../redisClient');
const IServiceConnector = require('./IServiceConnector');

class RedisConnector extends IServiceConnector {
  async connectIfNeeded() {
    if (!redisClient.isOpen) {
      console.log('🔄 Connecting to Redis...');
      await connectRedis();
      console.log('🟢 Redis connected');
    }
  }
}

module.exports = RedisConnector;