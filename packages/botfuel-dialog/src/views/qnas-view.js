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

const logger = require('logtown')('QnasView');
const BotTextMessage = require('../messages/bot-text-message');
const View = require('./view');

/**
 * Qnas dialog's view.
 * @extends View
 */
class QnasView extends View {
  /** @inheritDoc */
  render(userMessage, { answers, messageEntities }) {
    logger.debug('render', userMessage, { answers, messageEntities });

    // for postback actions, answers are stored in messageEntities
    return (answers || messageEntities)[0].map(
      message => new BotTextMessage(message.payload.value),
    );
  }
}

module.exports = QnasView;
