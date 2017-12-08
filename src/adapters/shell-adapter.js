/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
   */
  constructor(bot) {
    super(bot);
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

  /** @inheritDoc */
  async sendMessage(botMessage) {
    // eslint-disable-next-line no-console
    console.log(chalk.hex('#16a085')(`${DELIMITER}${botMessage.payload.value}`));
  }
}

module.exports = ShellAdapter;
