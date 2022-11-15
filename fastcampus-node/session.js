'use strict'

const CacheManager = require('./cache')

class SessionManager extends CacheManager {
    constructor() {
      super()
    }

    static createSession() {
      this.session = []
    }
}

const session1 = new SessionManager();

session1.addConfig({
  token : 'random'
});

console.log(session1.getConfig())

SessionManager.createSession();