const inquirer = require('inquirer');
const logger = require('logtown')('ShellAdapter');
const { BotTextMessage, UserTextMessage } = require('../messages');
const Adapter = require('./adapter');

/**
 * Shell adapter
 * @extends Adapter
 */
class ShellAdapter extends Adapter {
  /**
   * @constructor
   * @param {Object} bot - the bot
   * @param {Object} config - the bot config
   */
  constructor(bot, config) {
    super(bot, config);
    this.userId = 'USER_1';
  }

  /**
   * Runs the adapter
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    await this.bot.brain.initUserIfNecessary(this.userId);
    const botMessage = new BotTextMessage('onboarding');
    const userInput = await this.send([
      botMessage.toJson(this.config.id, this.userId)
    ]);
    await this.runWhenUserInput(userInput);
  }

   async runWhenUserInput(userInput) {
     logger.debug('runWhenUserInput', userInput);
     const userMessage = new UserTextMessage(userInput.payload);
     const userInput = await this.bot.respond(userMessage.toJson(this.config.id, this.userId));
     await this.runWhenUserInput(userInput);
  }
  /**
   * Sends bot messages to the shell
   * @async
   * @param {Object[]} botMessages - the bot messages
   * @returns {Promise} the prompt
   */
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
