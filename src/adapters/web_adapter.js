const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const Adapter = require('./adapter');

const CHAT_SERVER = 'https://botfuel-webchat-server.herokuapp.com';
const BOTFUEL_ADAPTER_WEBHOOK = '/webhook';
const BOTFUEL_ADAPTER_PORT = process.env.PORT || 5000;

class WebAdapter extends Adapter {
  /**
   * Run the adapter
   * @returns {Promise.<void>}
   */
  async run() {
    console.log('WebAdapter.run');
    const app = express();
    app.use(bodyParser.json());
    this.createRoutes(app);
    app.listen(BOTFUEL_ADAPTER_PORT, () => {
      console.log('WebAdapter.run: listening on port', BOTFUEL_ADAPTER_PORT);
    });
  }

  /**
   * Create adapter routes
   * @param app
   */
  createRoutes(app) {
    app.post(BOTFUEL_ADAPTER_WEBHOOK, this.handleMessage);
  }

  /**
   * Send botMessages to web platform adapter
   * @param botMessages
   * @returns {Promise}
   */
  async send(botMessages) {
    console.log('WebAdapter.send', botMessages);
    const responses = [];
    botMessages.forEach((botMessage) => {
      // TODO: add switch for message type
      responses.push(this.sendText(botMessage));
    });
    await Promise.all(responses);
  }

  /**
   * Request web platform to send response
   * @param requestOptions
   * @returns {Promise}
   */
  async sendResponse(requestOptions) {
    const options = Object.assign({ method: 'POST', json: true }, requestOptions);
    rp(options)
      .then((response) => {
        if (response.statusCode === 200) {
          console.log('WebAdapter.sendText: OK');
        }
      })
      .catch((error) => {
        console.error('WebAdapter.sendText: KO');
        console.error(error);
      });
  }
}

module.exports = WebAdapter;
