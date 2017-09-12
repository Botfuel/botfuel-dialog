const inquirer = require('inquirer');
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
    await this.initUserIfNecessary(this.userId);
    let userMessage = await this.bot.onboard(this.userId);
    for (;;) {
      userMessage.type = 'text';
      userMessage.userId = this.userId;
      userMessage.botId = this.bot.id;
      userMessage.origin = 'user';
      userMessage = await this.bot.respond(userMessage);
    }
  }

  async send(botMessages) {
    console.log('ShellAdapter.send', botMessages);
    const message = botMessages.map(botMessage => botMessage.payload).join(' ');
    console.log('ShellAdapter.send: message', message);
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
