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

// @flow

import type { BotMessageJson } from '../messages/message';

const logger = require('logtown')('BotfuelAdapter');
const WebAdapter = require('./web-adapter');

const CHAT_SERVER_URL = process.env.CHAT_SERVER || 'https://webchat.botfuel.io';

/**
 * Adapter for Botfuel's webchat.
 * @extends WebAdapter
 */
class BotfuelAdapter extends WebAdapter {
  /** @inheritDoc */
  createRoutes(app: express$Application) {
    logger.debug('createRoutes');
    super.createRoutes(app);
    app.get('/webchat/:name', this.renderWebchatFile);
  }

  /** @inheritDoc */
  async handleRequest(req: express$Request, res: express$Response): Promise<void> {
    logger.debug('handleRequest', req.body);
    res.sendStatus(200);
    const message = (req.body: any);
    await this.handleMessage(message);
  }

  /** @inheritDoc */
  getUrl(botMessage: BotMessageJson) {
    const appToken: string = (process.env.BOTFUEL_APP_TOKEN: any);
    return `${CHAT_SERVER_URL}/bots/${appToken}/users/${
      botMessage.user
    }/conversation/messages`;
  }

  /** @inheritDoc */
  getQueryParameters() {
    return {};
  }

  /** @inheritDoc */
  getBody(botMessage: BotMessageJson) {
    return botMessage;
  }

  /**
   * Render a file inside the bot webchat directory if exists
   * It allow to serve webchat directly through the bot
   * @param req
   * @param res
   * @returns {void}
   */
  renderWebchatFile(req: express$Request, res: express$Response) {
    res.sendFile(req.params.name, { root: `${this.bot.config.path}/webchat` });
  }
}

module.exports = BotfuelAdapter;
