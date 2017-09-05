const inquirer = require('inquirer');
const Adapter = require('./adapter');

const USER_ID = 1;

/**
 * Shell Adapter.
 */
class ShellAdapter extends Adapter {
  getId(message) {
    return message.id;
  }

  getText(message) {
    return message.text;
  }

  run() {

  }

  onboard() {
    // TODO: fix this
    this.bot({ id: USER_ID, text: this.config.onboarding[0]});
  }

  send(response) {
    console.log('Adapter.send', response);
    // when text (TODO: fix this)
    console.log(response.payload);
  }
}

module.exports = ShellAdapter;



    const questions = [
      {
        type: 'input',
        name: 'input',
        message: onboarding
      }
    ];
    inquirer
      .prompt(questions)
      .then(function (answers) {
        console.log(JSON.stringify(answers, null, '  '));
      });
