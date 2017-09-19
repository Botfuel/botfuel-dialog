const bodyParser = require('body-parser');
const express = require('express');
const rp = require('request-promise');
const Messages = require('../messages');
const Adapter = require('./adapter');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'BotSDK2Sample';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || 'EAAEBdpxs1WkBALtbvWqCwupvQZCAfRvxZBDtZBvCW96gkMAS110MfoGHCDxV4sRKSN8hl34pkSAG97vMMI0NZBAW8VZAZC5LJAZB5wB7SCBhBm7dGynZC0Jl4DvykWrXqKc7W4KRKv4iTZBvoV7IyeAtpdZCZAGiZAhKcQZB2qHdKBUL6lQZDZD';
const PORT = process.env.PORT || 5000;

/**
 * Shell Adapter.
 */
class FacebookAdapter extends Adapter {
  constructor(bot, config) {
    super(bot, config);
    this.server = express();
    this.fbOptions = {
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
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
    console.log('FacebookAdapter.run');
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
      if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
        console.log('FacebookAdapter.serve: Validating webhook');
        res.status(200).send(req.query['hub.challenge']);
      } else {
        console.error('FacebookAdapter.serve: Failed validation.');
        res.sendStatus(403);
      }
    });
    // messaging webhook
    this.server.post('/webhook', (req, res) => {
      const data = req.body;
      if (data.object === 'page') {
        // Iterate over each entry
        data.entry.forEach((entry) => {
          console.log('FacebookAdapter.serve: data entry', entry);
          // Iterate over each messaging event
          entry.messaging.forEach((event) => {
            if (event.message) {
              this.listen(event);
            } else {
              console.log('FacebookAdapter.serve: received unknown event: ', event);
            }
          });
        });
        res.sendStatus(200);
      }
    });
    // server listen
    this.server.listen(PORT, () => console.log('FacebookAdapter.serve: running on port', PORT));
  }

  /**
   * Request messenger to send response
   * @param messageData
   * @returns {Promise.<void>}
   */
  async sendResponse(messageData) {
    console.log('FacebookAdapter.sendResponse: messageData', messageData);
    rp(Object.assign(this.fbOptions, { body: messageData }))
      .then((response, body) => {
        if (response.statusCode === 200) {
          const recipientId = body.recipient_id;
          const messageId = body.message_id;
          console.log(`FacebookAdapter.sendResponse: message sent with id ${messageId} to recipient ${recipientId}`);
        }
      }).catch((error) => {
        console.error('FacebookAdapter.sendResponse: Unable to send message.');
        console.error(error);
      });
  }

  /**
   * Send bot messages to messenger user
   * @param botMessages
   * @returns {Promise.<void>}
   */
  async send(botMessages) {
    console.log('FacebookAdapter.send: botMessages', botMessages);
    const responses = [];
    botMessages.forEach((botMessage) => {
      const messageData = {
        recipient: {
          id: botMessage.userId,
        },
        message: {
          text: botMessage.payload,
        },
      };
      responses.push(this.sendResponse(messageData));
    });
    await Promise.all(responses);
  }

  /**
   * Receive user message and send it to the bot
   * @param event
   * @returns {Promise.<void>}
   */
  async listen(event) {
    const userId = event.sender.id;
    const botId = event.recipient.id;
    const message = event.message;
    const messageText = message.text;
    console.log('FacebookAdapter.listen', userId, botId, JSON.stringify(message));

    // init user if necessary
    await this.bot.brain.initUserIfNecessary(userId);

    if (messageText) {
      const userMessage = Messages.getUserTextMessage(botId, userId, messageText);
      await this.bot.sendResponse(userMessage);
    }
  }
}

module.exports = FacebookAdapter;
