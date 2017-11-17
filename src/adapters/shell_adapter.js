const readline = require('readline');
const chalk = require('chalk');
const logger = require('logtown')('ShellAdapter');
const { BotTextMessage, UserTextMessage } = require('../messages');
const Adapter = require('./adapter');

const DELIMITER = `${chalk.bold('> ')}`;
const MESSAGE_JOIN = `\n${DELIMITER}`;

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

  /**
   * Runs the adapter
   * @async
   * @returns {Promise.<void>}
   */
  async run() {
    logger.debug('run');
    await this.bot.brain.initUserIfNecessary(this.userId);
    const botMessage = new BotTextMessage('onboarding');
    await this.send([botMessage.toJson(this.bot.id, this.userId)]);
    this.rl.on('line', (input) => {
      this.runWhenUserInput({ payload: input }).then(() => logger.debug('The loop is done !'));
    });
  }

  /**
   * Runs recursively for each user input
   * @async
   * @param {Object} userInput - the user input
   * @returns {Promise.<void>}
   */
  async runWhenUserInput(userInput) {
    logger.debug('runWhenUserInput', userInput);
    const userMessage = new UserTextMessage(userInput.payload);
    await this.bot.respond(userMessage.toJson(this.bot.id, this.userId));
  }

  /**
   * Sends bot messages to the shell
   * @async
   * @param {Object[]} botMessages - the bot messages
   * @returns {Promise} the prompt
   */
  async send(botMessages) {
    logger.debug('send', botMessages);
    const output = botMessages.map(botMessage => botMessage.payload.value).join(MESSAGE_JOIN);
    console.log(chalk.hex('#16a085')(`${DELIMITER}${output}`)); // logs the bot message(s)
  }
}

module.exports = ShellAdapter;
