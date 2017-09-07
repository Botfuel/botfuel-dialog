const inquirer = require('inquirer');
const Adapter = require('./adapter');

const USER_ID = 1;

/**
 * Shell Adapter.
 */
class ShellAdapter extends Adapter {
  run() {
    console.log('ShellAdapter.run');
    this
      .bot
      .onboard()
      .then((userMessage) => {
        userMessage.type = 'text';
        userMessage.id = USER_ID;
        this.bot.respond(userMessage);
      });;
  }

  send(botMessage) {
    console.log('ShellAdapter.send', botMessage);
    // type text
    return inquirer.prompt([
      {
        type: 'input',
        name: 'payload',
        message: botMessage.payload
      }
    ])
  }
}

module.exports = ShellAdapter;
