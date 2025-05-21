const mongoose = require('mongoose');
const IServiceConnector = require('./IServiceConnector');

class MongoConnector extends IServiceConnector {
  constructor(uri) {
    super();
    this.uri = uri;
  }

  async connectIfNeeded() {
    if (mongoose.connection.readyState !== 1) {
      console.log('🔄 Connecting to MongoDB...');
      await mongoose.connect(this.uri);
      console.log('🟢 MongoDB connected');
    }
  }
}

module.exports = MongoConnector;