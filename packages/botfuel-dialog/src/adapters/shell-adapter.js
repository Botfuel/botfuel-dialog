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
const uuidv4 = require('uuid/v4');
const UserTextMessage = require('../messages/user-text-message');
const PostbackMessage = require('../messages/postback-message');
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
    this.userId = uuidv4();
    this.botTextColor = '#16a085';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // eslint-disable-next-line require-jsdoc
  async run() {
    logger.debug('run');
    this.rl.on('line', async (input) => {
      const userMessage = new UserTextMessage(input).toJson(this.userId);
      await this.handleMessage(userMessage);
    });
  }

  /* eslint-disable no-console */
  /** @inheritDoc */
  async sendMessage(botMessage) {
    if (botMessage.type === 'actions') {
      await this.sendActionsMessage(botMessage);
    } else {
      console.log(chalk.hex(this.botTextColor)(`${DELIMITER}${botMessage.payload.value}`));
    }
  }

  /**
   * Send actions message
   * @param {Object} actionsMessage actionMessage
   * @returns {Promise.<void>}
   */
  async sendActionsMessage(actionsMessage) {
    const actions = actionsMessage.payload.value;
    let str = 'Please select:\n';
    actions.forEach((action, index) => {
      str += `${index + 1}: (${action.type}) ${action.text}\n`;
    });

    this.rl.question(chalk.hex(this.botTextColor)(str), async (answer) => {
      const id = parseInt(answer, 10);
      if (id >= 1 && id <= actions.length) {
        const selected = actions[id - 1];
        // postback
        if (selected.type === 'postback') {
          const userMessage = new PostbackMessage({
            name: selected.value.name,
            data: selected.value.data,
          }).toJson(this.userId);
          await this.handleMessage(userMessage);
          // link
        } else if (selected.type === 'link') {
          console.log(chalk.hex(this.botTextColor)(`open link: ${selected.value}`));
        }
      } else {
        console.log(chalk.red('Invalid choice!'));
      }
    });
  }
}

module.exports = ShellAdapter;
