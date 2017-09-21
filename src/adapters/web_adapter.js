const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const Adapter = require('./adapter');

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
    const port = process.env.PORT || process.env.BOTFUEL_ADAPTER_PORT || 5000;
    app.listen(port, () => {
      console.log('WebAdapter.run: listening on port', port);
    });
  }

  /**
   * Create adapter routes
   * @param app
   */
  createRoutes(app) {
    app.post('/webhook', (req, res) => this.handleMessage(req, res));
  }

  /**
   * Send botMessages to web platform adapter
   * @param botMessages
   * @returns {Promise}
   */
  async send(botMessages) {
    console.log('WebAdapter.send', botMessages);
    const promises = [];
    for (const botMessage of botMessages) {
      // TODO: add switch for message type
      // TODO: how do we guarantee the order
      promises.push(this.sendText(botMessage));
    }
    await Promise.all(promises);
  }

  /**
   * Request web platform to send response
   * @param requestOptions
   * @returns {Promise}
   */
  async sendResponse(requestOptions) {
    console.log('WebAdapter.sendResponse', requestOptions);
    const options = Object.assign({ method: 'POST', json: true }, requestOptions);
    try {
      const response = await rp(options);
      if (response.statusCode === 200) {
        console.log('WebAdapter.sendText: OK');
      }
    } catch (error) {
      console.error('WebAdapter.sendText: KO', error);
    }
  }
}

module.exports = WebAdapter;
