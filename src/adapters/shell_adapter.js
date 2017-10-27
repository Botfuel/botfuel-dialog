const inquirer = require('inquirer');
const logger = require('logtown')('ShellAdapter');
const { BotTextMessage, UserTextMessage } = require('../messages');
const Adapter = require('./adapter');

/**
 * Shell Adapter.
 */
class ShellAdapter extends Adapter {
  constructor(bot, config) {
    super(bot, config);
    this.userId = 'USER_1';
  }

  async run() {
    logger.debug('run');
    await this.bot.brain.initUserIfNecessary(this.userId);
    const botMessage = new BotTextMessage(this.config.id, this.userId, 'onboarding').toJson();
    let userInput = await this.send([botMessage]);
    for (;;) {
      logger.debug('run: userInput', userInput);
      const userMessage = new UserTextMessage(
        this.config.id,
        this.userId,
        userInput.payload,
      ).toJson();
      // eslint-disable-next-line no-await-in-loop
      userInput = await this.bot.sendResponse(userMessage);
    }
  }

  async send(botMessages) {
    logger.debug('send', botMessages);
    // TODO: adapt to msg type
    const message = botMessages.map(botMessage => botMessage.payload.value).join(' ');
    // type text
    return inquirer.prompt([
      {
        type: 'input',
        name: 'payload',
        message,
      },
    ]);
  }
}

module.exports = ShellAdapter;
