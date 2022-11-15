'use strict'

class CacheManager {
  constructor() {
    /* 
      클래스 생성자에서는 비동기 처리를 수행할 수 없다 

      const call = async API... -> (X)
    */

    this.config = [];
  }

  addConfig (obj = {}) {
    this.config.push(obj)
  }

  getConfig() {
    return this.config;
  }
}

module.exports = CacheManager