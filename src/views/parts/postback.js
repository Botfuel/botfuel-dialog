const Action = require('./action');

class Postback extends Action {
  constructor(text, dialogLabel, entities) {
    super('postback', text, {
      dialog: { label: dialogLabel },
      entities,
    });
  }
}

module.exports = Postback;
