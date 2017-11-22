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

/**
 * Adapter for Botfuel's webchat.
 * @extends WebAdapter
 */
class BotfuelAdapter extends WebAdapter {
  // eslint-disable-next-line require-jsdoc
  async handleMessage(req, res) {
    logger.debug('handleMessage');
    res.sendStatus(200);
    const userMessage = req.body; // the message is already in the expected format
    logger.debug('handleMessage: userMessage', userMessage);
    const userId = userMessage.user;
    await this.bot.brain.initUserIfNecessary(userId);
    await this.bot.respond(userMessage);
  }

  // eslint-disable-next-line require-jsdoc
  getUri(botMessage) {
    return `${process.env.CHAT_SERVER}/bots/${this.bot.id}/users/${botMessage.user}/conversation/messages`;
  }

  // eslint-disable-next-line require-jsdoc
  getQs() {
    return {};
  }

  // eslint-disable-next-line require-jsdoc
  getBody(botMessage) {
    return botMessage;
  }
}

module.exports = BotfuelAdapter;
