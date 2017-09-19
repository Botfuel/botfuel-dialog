const inquirer = require('inquirer');
const Adapter = require('./adapter');
const Messages = require('../messages');

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
    const botMessage = Messages.getBotTextMessage(this.config.id, this.userId, 'onboarding');
    const userMessage = await this.send([botMessage]);
    this.loop(userMessage);
  }

  async loop(userMsg) {
    console.log('ShellAdapter.loop', userMsg);
    const userMessage = Messages.getUserTextMessage(this.config.id, this.userId, userMsg.payload);
    this.loop(await this.bot.sendResponse(userMessage));
  }

  async send(botMessages) {
    console.log('ShellAdapter.send', botMessages);
    // TODO: adapt to msg type
    const message = botMessages.map(botMessage => botMessage.payload).join(' ');
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
