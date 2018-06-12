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

const logger = require('logtown')('IntentResolutionView');
const ActionsMessage = require('../messages/actions-message');
const BotTextMessage = require('../messages/bot-text-message');
const Postback = require('../messages/postback');
const View = require('./view');

/**
 * Intent Resolution Dialog's View.
 * @extends View
 */
class ClassificationDisambiguationView extends View {
  /** @inheritDoc */
  render(userMessage, { classificationResults, messageEntities }) {
    logger.debug('render', userMessage, { classificationResults, messageEntities });

    const postbacks = classificationResults.map((cr) => {
      const resolvePrompt = cr.resolvePrompt || `[${cr.label.toUpperCase()}]`;

      if (cr.isQnA()) {
        return new Postback(resolvePrompt, cr.name, cr.answers);
      }
      return new Postback(resolvePrompt, cr.name, messageEntities);
    });

    const option = {
      text: 'disambiguation',
    };

    return [new BotTextMessage('What do you mean?'), new ActionsMessage(postbacks, option)];
  }
}

module.exports = ClassificationDisambiguationView;
