const Message = require('./message');

class Hook extends Message {
  constructor(name, args, options = {}) {
    super('hook', 'user', { name, args }, options);
  }
}

module.exports = Hook;
