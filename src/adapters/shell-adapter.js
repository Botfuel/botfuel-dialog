const readline = require('readline');
const chalk = require('chalk');
const logger = require('logtown')('ShellAdapter');
const { BotTextMessage, UserTextMessage } = require('../messages');
const Adapter = require('./adapter');

const DELIMITER = `${chalk.bold('> ')}`;

/**
 * Shell adapter.
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
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // eslint-disable-next-line require-jsdoc
  async run() {
    logger.debug('run');
    await this.bot.brain.initUserIfNecessary(this.userId);
    const botMessage = new BotTextMessage('onboarding');
    await this.send([botMessage.toJson(this.bot.id, this.userId)]);
    this.rl.on('line', async (input) => {
      await this.runWhenUserInput({ payload: input });
    });
  }

  /**
   * Runs recursively for each user input.
   * @async
   * @private
   * @param {Object} userInput - the user input
   * @returns {Promise.<void>}
   */
  async runWhenUserInput(userInput) {
    logger.debug('runWhenUserInput', userInput);
    const userMessage = new UserTextMessage(userInput.payload);
    await this.bot.respond(userMessage.toJson(this.bot.id, this.userId));
  }

  // eslint-disable-next-line require-jsdoc
  async sendMessage(botMessage) {
    // logs the bot message
    console.log(chalk.hex('#16a085')(`${DELIMITER}${botMessage.payload.value}`));
  }
}

module.exports = ShellAdapter;
