'use strict';

const Dialog = require('./dialog');

class PromptDialog extends Dialog {
  constructor(dm, entities, parameters) {
    super(dm, parameters);
    this.entities = entities;
  }

  execute(id, responses) {
    responses.push(JSON.stringify(this.entities)); // use template instead
    return Promise.resolve(true);
  }
}

module.exports = PromptDialog;
