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
    app.listen(port, () => console.log('WebAdapter.run: listening on port', port));
  }

  /**
   * Create adapter routes
   * @param app
   */
  createRoutes(app) {
    app.post('/webhook', (req, res) => this.handleMessage(req, res));
  }

  /**
   * Request web platform to send response
   * @param requestOptions
   * @returns {Promise}
   */
  async postResponse(requestOptions) {
    console.log('WebAdapter.sendResponse', requestOptions);
    const options = Object.assign({ method: 'POST', json: true }, requestOptions);
    try {
      const response = await rp(options);
      if (response.statusCode !== 200) { // not handled on messenger
        console.error('WebAdapter.sendResponse: KO', response);
      } else {
        console.log('WebAdapter.sendResponse: OK');
      }
    } catch (error) {
      console.error('WebAdapter.sendResponse: catch KO', error.message || error.error || error);
    }
  }
}

module.exports = WebAdapter;
