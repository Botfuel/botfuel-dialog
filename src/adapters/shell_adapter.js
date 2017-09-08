const inquirer = require('inquirer');
const Adapter = require('./adapter');

const USER_ID = '1';

/**
 * Shell Adapter.
 */
class ShellAdapter extends Adapter {
  async run() {
    console.log('ShellAdapter.run');
    let userMessage = await this.bot.onboard(USER_ID);
    while (true) {
      userMessage.type = 'text';
      userMessage.id = USER_ID;
      userMessage = await this.bot.respond(userMessage);
    }
  }

  async send(botMessages) {
    console.log('ShellAdapter.send', botMessages);
    await this.initUserIfNecessary(USER_ID);
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
