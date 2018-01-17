'use strict';

const { TextDialog } = require('botfuel-dialog');

class ResetDialog extends TextDialog {
  async dialogWillComplete() {
    return this.startNewConversation('greetings');
  }
}

module.exports = ResetDialog;
