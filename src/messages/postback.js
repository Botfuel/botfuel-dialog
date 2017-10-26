const Action = require('./action');

class Postback extends Action {
  constructor(text, dialog, entities) {
    super('postback', text, { dialog, entities });
  }
}

module.exports = Postback;
