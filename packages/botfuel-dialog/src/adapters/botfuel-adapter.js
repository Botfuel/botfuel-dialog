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
const UserTextMessage = require('../messages/user-text-message');
const PostbackMessage = require('../messages/postback-message');

const CHAT_SERVER_URL = process.env.CHAT_SERVER || 'https://webchat.botfuel.io';

/**
 * Adapter for Botfuel's webchat.
 * @extends WebAdapter
 */
class BotfuelAdapter extends WebAdapter {
  /** @inheritDoc */
  async handleRequest(req, res) {
    logger.debug('handleRequest', req.body);
    let userMessage = null;
    try {
      userMessage = this.buildUserMessage(req.body);
      logger.debug('handleRequest: userMessage', userMessage);
      res.sendStatus(200);
      return this.handleMessage(userMessage);
    } catch (error) {
      return res.status(400).send({ message: error.message, error });
    }
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

  /**
   * Build the user message from the request body
   * @param message {Object} - the request body
   * @returns {BotMessageJson} - the user message in JSON format
   */
  buildUserMessage(message) {
    // Define message origin property
    const origin = {
      adapter: 'Botfuel',
      referrer: message.referrer,
    };
    // Build message
    let userMessage = null;
    switch (message.type) {
      case 'postback':
        userMessage = new PostbackMessage(message.payload.value, { origin });
        break;
      case 'text':
        userMessage = new UserTextMessage(message.payload.value, { origin });
        break;
      default:
        userMessage = new UserTextMessage(`Message of type ${message.type} are not supported.`);
    }
    // Add user ID and timestamp to message then return it
    return userMessage.toJson(message.user);
  }
}

module.exports = BotfuelAdapter;
