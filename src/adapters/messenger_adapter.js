const bodyParser = require('body-parser');
const express = require('express');
const rp = require('request-promise');
const Messages = require('../messages');
const Adapter = require('./adapter');

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'BotSDK2Sample';
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || 'EAAEBdpxs1WkBALtbvWqCwupvQZCAfRvxZBDtZBvCW96gkMAS110MfoGHCDxV4sRKSN8hl34pkSAG97vMMI0NZBAW8VZAZC5LJAZB5wB7SCBhBm7dGynZC0Jl4DvykWrXqKc7W4KRKv4iTZBvoV7IyeAtpdZCZAGiZAhKcQZB2qHdKBUL6lQZDZD';
const PORT = process.env.PORT || 5000;

/**
 * Messenger Adapter.
 */
class MessengerAdapter extends Adapter {
  constructor(bot, config) {
    super(bot, config);
    this.server = express();
    this.fbOptions = {
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: FB_PAGE_ACCESS_TOKEN },
      method: 'POST',
      body: null,
      json: true,
    };
  }

  /**
   * Run the adapter
   * @returns {Promise.<void>}
   */
  async run() {
    console.log('MessengerAdapter.run');
    await this.serve();
  }

  /**
   * Initialise and start adapter server
   * @returns {Promise.<void>}
   */
  async serve() {
    this.server.use(bodyParser.json());
    this.server.use(express.static('public'));
    // authentication webhook
    this.server.get('/webhook', (req, res) => {
      if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
        console.log('MessengerAdapter.serve: Validating webhook');
        res.status(200).send(req.query['hub.challenge']);
      } else {
        console.error('MessengerAdapter.serve: Failed validation.');
        res.sendStatus(403);
      }
    });
    // messaging webhook
    this.server.post('/webhook', (req, res) => {
      const data = req.body;
      if (data.object === 'page') {
        // Iterate over each entry
        data.entry.forEach((entry) => {
          console.log('MessengerAdapter.serve: data entry', entry);
          // Iterate over each messaging event
          entry.messaging.forEach(async (event) => {
            if (event.message) {
              await this.listen(event);
            } else {
              console.log('MessengerAdapter.serve: received unknown event: ', event);
            }
          });
        });
        res.sendStatus(200);
      }
    });
    // server listen
    this.server.listen(PORT, () => console.log('MessengerAdapter.serve: running on port', PORT));
  }

  /**
   * Request messenger to send response
   * @param botMessage
   * @returns {Promise.<void>}
   */
  async sendText(botMessage) {
    const messageData = {
      recipient: {
        id: botMessage.userId,
      },
      message: {
        text: botMessage.payload,
      },
    };
    console.log('MessengerAdapter.sendResponse: messageData', messageData);
    rp(Object.assign(this.fbOptions, { body: messageData }))
      .then((response, body) => {
        if (response.statusCode === 200) {
          const recipientId = body.recipient_id;
          const messageId = body.message_id;
          console.log(`MessengerAdapter.sendResponse: message sent with id ${messageId} to recipient ${recipientId}`);
        }
      }).catch((error) => {
        console.error('MessengerAdapter.sendResponse: Unable to send message.');
        console.error(error);
      });
  }

  /**
   * Send bot messages to messenger user
   * @param botMessages
   * @returns {Promise.<void>}
   */
  async send(botMessages) {
    console.log('MessengerAdapter.send: botMessages', botMessages);
    const responses = [];
    botMessages.forEach((botMessage) => {
      responses.push(this.sendText(botMessage));
    });
    await Promise.all(responses);
  }

  /**
   * Receive user message and send it to the bot
   * @param event
   * @returns {Promise.<void>}
   */
  async listen(event) {
    const userId = event.sender.id; // messenger user id
    const botId = event.recipient.id; // page id
    const message = event.message;
    const messageText = message.text;
    console.log('MessengerAdapter.listen', userId, botId, JSON.stringify(message));

    // init user if necessary
    await this.bot.brain.initUserIfNecessary(userId);

    if (messageText) {
      const userMessage = Messages.getUserTextMessage(botId, userId, messageText);
      await this.bot.sendResponse(userMessage);
    }
  }
}

module.exports = MessengerAdapter;
