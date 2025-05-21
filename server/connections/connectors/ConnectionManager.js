class ConnectionManager {
    constructor(connectors = []) {
      this.connectors = connectors;
    }
  
    async initializeAll() {
      for (const connector of this.connectors) {
        await connector.connectIfNeeded();
      }
    }
  }
  
  module.exports = ConnectionManager;
  