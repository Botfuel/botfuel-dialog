'use strict';

const Dialog = require('./dialog');

class PromptDialog extends Dialog {
  constructor(entities) {
    super(null);
    this.entities = entities;
  }

  execute(dm) {
    dm.respond(JSON.stringify(dm.entities)); // use template instead
    return Promise.resolve(true);
  }
}

module.exports = PromptDialog;
