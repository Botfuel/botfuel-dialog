const inquirer = require('inquirer');
const Messages = require('../messages');
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
    console.log('ShellAdapter.run');
    await this.bot.brain.initUserIfNecessary(this.userId);
    const botMessage = Messages.botText(this.config.id, this.userId, 'onboarding');
    let userInput = await this.send([botMessage]);
    for (;;) {
      const userMessage = Messages.userText(this.config.id, this.userId, userInput.payload);
      // eslint-disable-next-line no-await-in-loop
      userInput = await this.bot.sendResponse(userMessage);
    }
  }

  async send(botMessages) {
    console.log('ShellAdapter.send', botMessages);
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
