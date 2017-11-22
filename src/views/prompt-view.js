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

const logger = require('logtown')('PromptView');
const { BotTextMessage } = require('../messages');
const View = require('./view');

/**
 * Prompt dialog's view.
 * @extends View
 */
class PromptView extends View {
  // eslint-disable-next-line require-jsdoc
  render(key, data) {
    logger.debug('render', key, data);
    switch (key) {
      case 'ask':
        return this.renderAsk();
      case 'confirm':
        return this.renderConfirm();
      case 'discard':
        return this.renderDiscard();
      case 'entities': {
        const { messageEntities, missingEntities } = data;
        return this.renderEntities(messageEntities, missingEntities);
      }
      default:
        return null;
    }
  }

  /**
   * Asks for confirmation.
   * @private
   * @returns {Object[]} the bot messages
   */
  renderAsk() {
    return [
      new BotTextMessage('continue dialog?'),
    ];
  }

  /**
   * Confirms the dialog.
   * @private
   * @returns {Object[]} the bot messages
   */
  renderConfirm() {
    return [
      new BotTextMessage('dialog confirmed.'),
    ];
  }

  /**
   * Discards the dialog.
   * @private
   * @returns {Object[]} the bot messages
   */
  renderDiscard() {
    return [
      new BotTextMessage('dialog discarded.'),
    ];
  }

  /**
   * Confirms the defined entities and asks for the needed ones.
   * @private
   * @param {Object[]} messageEntities - the defined entities
   * @param {String[]} missingEntities - the needed entities
   * @returns {Object[]} the bot messages
   */
  renderEntities(messageEntities, missingEntities) {
    const messages = [];
    if (messageEntities.length !== 0) {
      messages.push(new BotTextMessage(
        `Entities defined: ${messageEntities.map(entity => entity.body).join(', ')}`,
      ));
    }
    if (missingEntities.length !== 0) {
      messages.push(new BotTextMessage(`Entities needed: ${missingEntities.join(', ')}`));
      messages.push(new BotTextMessage(`Which ${missingEntities[0]}?`));
    }
    return messages;
  }
}

module.exports = PromptView;
