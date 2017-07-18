'use strict';

const PromptDialog = require('./prompt_dialog');

class Travel extends PromptDialog {
  constructor() {
    super(['date', 'location']);
  }
}

module.exports = Travel;
