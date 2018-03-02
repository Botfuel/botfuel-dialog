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

const logger = require('logtown')('BotfuelAdapter');
const WebAdapter = require('./web-adapter');

const CHAT_SERVER_URL = process.env.CHAT_SERVER || 'https://webchat.botfuel.io';

/**
 * Adapter for Botfuel's webchat.
 * @extends WebAdapter
 */
class BotfuelAdapter extends WebAdapter {
  /** @inheritDoc */
  async handleRequest(req, res) {
    logger.debug('handleRequest', req.body);
    res.sendStatus(200);
    await this.handleMessage(req.body);
  }

  /** @inheritDoc */
  getUrl(botMessage) {
    return `${CHAT_SERVER_URL}/bots/${process.env.BOTFUEL_APP_TOKEN}/users/${
      botMessage.user
    }/conversation/messages`;
  }

  /** @inheritDoc */
  getQueryParameters() {
    return {};
  }

  /** @inheritDoc */
  getBody(botMessage) {
    return botMessage;
  }
}

module.exports = BotfuelAdapter;
