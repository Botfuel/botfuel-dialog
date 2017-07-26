'use strict';

const PromptDialog = require('./prompt_dialog');

class Travel extends PromptDialog {
  constructor() {
    console.log("Travel.constructor");
    super({ entities: ['date', 'location'] });
  }
}

module.exports = Travel;
