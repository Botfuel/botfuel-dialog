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
const _ = require('lodash');
const BotTextMessage = require('../messages/bot-text-message');
const View = require('./view');

/**
 * Prompt dialog's view.
 * @extends View
 */
class PromptView extends View {
  /** @inheritDoc */
  render(userMessage, { matchedEntities, missingEntities, extraData }) {
    logger.debug('render', userMessage, { matchedEntities, missingEntities, extraData });
    return this.renderEntities(matchedEntities, missingEntities, extraData);
  }

  /**
   * Confirms the defined entities and asks for the needed ones.
   * @private
   * @param {Object[]} matchedEntities - the defined entities
   * @param {String[]} missingEntities - the needed entities
   * @param {Object} [extraData] - additional data from dialogWillDisplay hook
   * @returns {Object[]} the bot messages
   */
  renderEntities(matchedEntities, missingEntities, extraData) {
    logger.debug('renderEntities', matchedEntities, missingEntities, extraData);
    const messages = [];
    if (Object.keys(matchedEntities).length !== 0) {
      messages.push(
        new BotTextMessage(
          `Entities defined: ${Object.keys(matchedEntities)
            .filter(name => !!matchedEntities[name])
            .join(', ')}`,
        ),
      );
    }
    if (Object.keys(missingEntities).length !== 0) {
      messages.push(
        new BotTextMessage(`Entities needed: ${Object.keys(missingEntities).join(', ')}`),
      );

      // highest priority entity must be asked first
      const { entity } = _.maxBy(
        Object.keys(missingEntities).map(key => ({
          entity: key,
          priority: missingEntities[key].priority || 0,
        })),
        'priority',
      );
      messages.push(new BotTextMessage(`Which ${entity}?`));
    }
    return messages;
  }
}

module.exports = PromptView;
