require('dotenv').config();
const app = require('./app');
const MongoConnector = require('./connection/connectors/MongoConnector');
const RedisConnector = require('./connection/connectors/RedisConnector');
const ConnectionManager = require('./connection/connectors/ConnectionManager');

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo-service:27017/your-db';
const RETRY_DELAY = 5000;

const connectors = [
  new MongoConnector(MONGO_URL),
  new RedisConnector()
];

const connectionManager = new ConnectionManager(connectors);

async function startServer() {
  try {
    await connectionManager.initializeAll();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Startup error:', err.message);
    console.log(`⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
    setTimeout(startServer, RETRY_DELAY);
  }
}

startServer();
