const Adapter = require('./adapter');
const Messages = require('../messages');
const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');

const CHAT_SERVER = 'https://botfuel-webchat-server.herokuapp.com';
const BOTFUEL_ADAPTER_WEBHOOK = '/botfuel';
const BOTFUEL_ADAPTER_PORT = 5000;

class WebAdapter extends Adapter {
  async run() {
    console.log('BotfuelAdapter.run');
    const app = express();
    app.use(bodyParser.json());
    this.createRoutes(app);
    app.listen(BOTFUEL_ADAPTER_PORT, () => {
      console.log('BotfuelAdapter.run: listening on port', BOTFUEL_ADAPTER_PORT);
    });
  }

  createRoutes(app) {
    app.post(BOTFUEL_ADAPTER_WEBHOOK, this.handleMessage);
  }

  async send(botMessages) {
    console.log('BotfuelAdapter.send', botMessages);
    for (const botMessage of botMessages) {
      // TODO: adapt to message type
      await this.sendText(botMessage);
    }
  }

  async postResponse(url, body) {
    rp({ uri: url, method: 'POST', body, json: true })
      .then((response, body) => {
        if (response.statusCode === 200) {
          console.log('WebAdapter.sendText: OK');
        }
      }).catch((error) => {
        console.error('WebAdapter.sendText: KO');
        console.error(error);
      });
  }
}

module.exports = BotfuelAdapter;
