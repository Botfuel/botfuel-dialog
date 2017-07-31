'use strict';

const PromptDialog = require('./prompt_dialog');

class Travel extends PromptDialog {
  constructor() {
    console.log("Travel.constructor");
    super({
      namespace: '_travel',
      entities: ['time', 'city'],
    });
  }
}

module.exports = Travel;
