const inquirer = require('inquirer');
const Adapter = require('./adapter');

const USER_ID = 'USER_1';

/**
 * Shell Adapter.
 */
class ShellAdapter extends Adapter {
  async run() {
    console.log('ShellAdapter.run');
    await this.initUserIfNecessary(USER_ID);
    let userMessage = await this.bot.onboard(USER_ID);
    for (;;) {
      userMessage.type = 'text';
      userMessage.userId = USER_ID;
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
