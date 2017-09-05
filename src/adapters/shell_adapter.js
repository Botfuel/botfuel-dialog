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

  onboard() {
    console.log('ShellAdapter.onboard');
    const onboardingMessage = {
      id: USER_ID,
      type: 'text',
      payload: this.config.onboarding.join(' ')
    };
    return this.send(onboardingMessage);
  }
}

module.exports = ShellAdapter;
