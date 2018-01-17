'use strict';

const { TextDialog } = require('botfuel-dialog');

class GreetingsDialog extends TextDialog {
  async dialogWillDisplay(userId) {
    const greetings = await this.brain.userGet(userId, 'greetings') || { greeted: false };
    if (!greetings.greeted) {
      await this.brain.userSet(userId, 'greetings', { greeted: true });
    }
    return greetings;
  }
}

module.exports = GreetingsDialog;
