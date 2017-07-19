'use strict';

const PromptDialog = require('./prompt_dialog');

class Travel extends PromptDialog {
  constructor(dm) {
    super(dm, ['date', 'location']);
  }
}

module.exports = Travel;
