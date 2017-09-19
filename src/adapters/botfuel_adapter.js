const Adapter = require('./adapter');
const Messages = require('../messages');
const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');

const WEBCHAT_SERVER = 'https://botfuel-webchat-server.herokuapp.com';
const WEBHOOK = '/botfuel';

class BotfuelAdapter extends Adapter {
  async run() {
    console.log('BotfuelAdapter.run');
    const app = express();
    app.use(bodyParser.json());
    app.post(WEBHOOK, async (req, res) => {
      const payload = req.body;
      console.log('BotfuelAdapter.run: payload', payload);
      const userId = payload.appUser._id;
      await this.bot.brain.initUserIfNecessary(userId);
      // if text message
      const message = payload.messages[0].text;
      const userMessage = Messages.getUserTextMessage(this.config.id, userId, message);
      this.bot.sendResponse(userMessage);
      res.sendStatus(200);
    });
    app.listen(5000, () => console.log('Listening on port 5000!'));
  }

  async send(botMessages) {
    console.log('BotfuelAdapter.send', botMessages);
    for (const botMessage of botMessages) {
      // TODO: adapt to message type
      await this.sendText(botMessage);
    }
  }

  async sendText(botMessage) {
    console.log('BotfuelAdapter.sendText', botMessage);
    const url = `${WEBCHAT_SERVER}/bots/${this.config.id}/users/${botMessage.userId}/conversation/messages`;
    const body = {
      type: 'text',
      text: botMessage.payload,
    };
    console.log('BotfuelAdapter.sendText: posting', url, body);
    rp({ uri: url, method: 'POST', body, json: true })
      .then((response, body) => {
        if (response.statusCode === 200) {
          console.log('BotfuelAdapter.sendText: OK');
        }
      }).catch((error) => {
        console.error('BotfuelAdapter.sendText: KO');
        console.error(error);
      });
  }
}

module.exports = BotfuelAdapter;
