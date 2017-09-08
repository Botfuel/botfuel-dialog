const inquirer = require('inquirer');
const Adapter = require('./adapter');

const USER_ID = '1';

/**
 * Test Adapter.
 */
class TestAdapter extends Adapter {
  async play(userMessages) {
    console.log('TestAdapter.play', userMessages);
    await this.initUserIfNecessary(USER_ID);
    for (const userMessage of userMessages) {
      await this.bot.respond(userMessage);
    }
  }

  async send(botMessages) {
    console.log('TestAdapter.send', botMessages);
    for (const botMessage of botMessages) {
      console.log('TestAdapter.send: message', botMessage);
    }
  }
}

module.exports = TestAdapter;
