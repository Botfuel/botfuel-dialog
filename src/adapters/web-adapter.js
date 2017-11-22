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

const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const logger = require('logtown')('WebAdapter');
const { MissingImplementationError } = require('../errors');
const Adapter = require('./adapter');

/**
 * Generic web adapter (to be subclassed).
 * @extends Adapter
 */
class WebAdapter extends Adapter {
  // eslint-disable-next-line require-jsdoc
  async run() {
    logger.debug('run');
    const app = express();
    app.use(bodyParser.json());
    this.createRoutes(app);
    const port = process.env.PORT || process.env.BOTFUEL_ADAPTER_PORT || 5000;
    app.listen(port, () => logger.debug('run: listening on port', port));
  }

  /**
   * Creates routes.
   * @param {Object} app - the express app
   * @returns {void}
   */
  createRoutes(app) {
    app.post('/webhook', (req, res) => this.handleMessage(req, res));
  }

  /**
   * Webhook used for handling messages.
   * @async
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @returns {Promise.<void>}
   */
  async handleMessage() {
    throw new MissingImplementationError();
  }

  // eslint-disable-next-line require-jsdoc
  async sendMessage(botMessage) {
    const requestOptions = {
      uri: this.getUri(botMessage),
      qs: this.getQs(),
      body: this.getBody(botMessage),
    };
    const options = Object.assign({ method: 'POST', json: true }, requestOptions);
    try {
      const res = await rp(options);
      if (res.statusCode && res.statusCode !== 200) { // not handled on messenger
        logger.error('postResponse: KO', res);
      } else {
        logger.debug('postResponse: OK');
      }
    } catch (error) {
      logger.error('postResponse: catch KO', error.message || error.error || error);
    }
  }
}

module.exports = WebAdapter;
