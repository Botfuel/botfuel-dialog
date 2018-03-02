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
const exphbs = require('express-handlebars');
const rp = require('request-promise-native');
const bodyParser = require('body-parser');
const logger = require('logtown')('WebAdapter');
const MissingImplementationError = require('../errors/missing-implementation-error');
const Adapter = require('./adapter');

/**
 * Generic web adapter (to be subclassed), it serves:
 * - /webhook : requests to the bot
 * - /static: static files under src/static
 * - /templates: handlebars templates under src/templates
 * @extends Adapter
 */
class WebAdapter extends Adapter {
  /** @inheritDoc */
  async run() {
    logger.debug('run');
    const app = express();
    app.use(bodyParser.json());
    app.use('/static', express.static('src/static'));
    const hbs = exphbs.create({});
    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', 'src/templates');
    this.createRoutes(app);
    const port = process.env.PORT || process.env.BOTFUEL_ADAPTER_PORT || 5000;
    app.listen(port, () => logger.info('run: listening on port', port));
  }

  /**
   * Creates routes.
   * @param {Object} app - the express app
   * @returns {void}
   */
  createRoutes(app) {
    logger.debug('createRoutes');
    app.post('/webhook', (req, res) => this.handleRequest(req, res));
    app.get('/templates/:id', (req, res) => this.handleTemplate(req, res));
  }

  /**
   * Webhook used for handling requests to the bot.
   * @async
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @returns {Promise.<void>}
   */
  async handleRequest() {
    throw new MissingImplementationError();
  }

  /**
   * Webhook used for handling template requests.
   * @async
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @returns {Promise.<void>}
   */
  async handleTemplate(req, res) {
    logger.debug('handleTemplate', { id: req.params.id, query: req.query });
    res.render(req.params.id, req.query, (err, html) => {
      if (err) {
        logger.error(`Could not render the handlebars template: ${req.params.id}`);
        res.status(400).send(err);
      } else {
        res.status(200).send(html);
      }
    });
  }

  /** @inheritDoc */
  async sendMessage(botMessage) {
    const requestOptions = {
      uri: this.getUrl(botMessage),
      qs: this.getQueryParameters(botMessage),
      body: this.getBody(botMessage),
    };
    const options = Object.assign({ method: 'POST', json: true }, requestOptions);
    try {
      const res = await rp(options).promise();
      if (res.statusCode && res.statusCode !== 200) {
        // not handled on messenger
        logger.error('postResponse: KO', res);
      } else {
        logger.debug('postResponse: OK');
      }
    } catch (error) {
      // TODO: is this what we want?
      logger.error('postResponse: catch KO', error.message || error.error || error);
    }
  }

  /**
   * Get the URL of the API used to send a bot message.
   * @async
   * @param {Object} botMessage - the bot response
   * @returns {null}
   */
  getUrl() {
    throw new MissingImplementationError();
  }

  /**
   * Get the query parameters to send along with a bot message.
   * @async
   * @param {Object} botMessage - the bot response
   * @returns {null}
   */
  getQueryParameters() {
    throw new MissingImplementationError();
  }

  /**
   * Get the body of the request when sending a bot message.
   * @async
   * @param {Object} botMessage - the bot response
   * @returns {null}
   */
  getBody() {
    throw new MissingImplementationError();
  }
}

module.exports = WebAdapter;
