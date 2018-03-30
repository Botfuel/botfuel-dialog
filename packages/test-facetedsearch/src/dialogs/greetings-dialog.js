const { TextDialog, Logger } = require('botfuel-dialog');

const logger = Logger('Greetings');

class Greetings extends TextDialog {
  async dialogWillDisplay(userMessage) {
    logger.debug('Greetings dialog being called');
    const userId = userMessage.user;
    const greetings = (await this.brain.userGet(userId, 'greetings')) || {
      greeted: false,
    };
    if (!greetings.greeted) {
      await this.brain.userSet(userId, 'greetings', { greeted: true });
    }
    return greetings;
  }
}

module.exports = Greetings;
