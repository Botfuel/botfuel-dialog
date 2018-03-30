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

const { Logger, BotTextMessage, View } = require('botfuel-dialog');

const logger = Logger('SearchView');

/**
 * Search dialog's view.
 * @extends View
 */
class SearchView extends View {
  /** @inheritDoc */
  render(userMessage, { matchedEntities, missingEntities, extraData }) {
    logger.debug('render', userMessage);
    return this.renderEntities(matchedEntities, missingEntities, extraData);
  }

  /**
   *
   */
  renderEntities(matchedEntities, missingEntities, extraData) {
    logger.debug('renderEntities', matchedEntities, missingEntities, extraData);
    const messages = [];

    if (missingEntities.size > 0) {
      messages.push(new BotTextMessage(`Which ${missingEntities.keys().next().value}?`));
    } else {
      messages.push(new BotTextMessage('Thank you. Here is your result:'));
    }
    return messages;
  }
}

module.exports = SearchView;
