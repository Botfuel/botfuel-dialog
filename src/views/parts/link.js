const Action = require('./action');

class Link extends Action {
  constructor(text, value) {
    super('link', text, value);
  }
}

module.exports = Link;
