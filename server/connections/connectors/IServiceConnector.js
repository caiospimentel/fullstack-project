class IServiceConnector {
    async connectIfNeeded() {
      throw new Error('connectIfNeeded() not implemented');
    }
  }
  
  module.exports = IServiceConnector;