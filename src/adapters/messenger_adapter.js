const Messages = require('../messages');
const WebAdapter = require('./web_adapter');

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'BotSDK2Sample';
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || 'EAAEBdpxs1WkBALtbvWqCwupvQZCAfRvxZBDtZBvCW96gkMAS110MfoGHCDxV4sRKSN8hl34pkSAG97vMMI0NZBAW8VZAZC5LJAZB5wB7SCBhBm7dGynZC0Jl4DvykWrXqKc7W4KRKv4iTZBvoV7IyeAtpdZCZAGiZAhKcQZB2qHdKBUL6lQZDZD';
const BOTFUEL_ADAPTER_WEBHOOK = '/webhook';

/**
 * Messenger Adapter.
 */
class MessengerAdapter extends WebAdapter {
  constructor(bot, config) {
    super(bot, config);
    this.requestOptions = {
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: FB_PAGE_ACCESS_TOKEN },
    };
  }

  /**
   * Override parent method to add extra route for this adapter
   * @param app
   */
  createRoutes(app) {
    super.createRoutes(app);
    app.get(BOTFUEL_ADAPTER_WEBHOOK, this.validateWebhook);
  }

  /**
   * Handler for validating messenger webhook
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise}
   */
  async validateWebhook(req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
      console.log('MessengerAdapter.serve: Validating webhook');
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error('MessengerAdapter.serve: Failed validation.');
      res.sendStatus(403);
    }
  }

  /**
   * Handler for messenger webhook post request
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise}
   */
  async handleMessage(req, res) {
    const data = req.body;
    if (data.object === 'page') {
      data.entry.forEach((entry) => {
        entry.messaging.forEach(async (event) => {
          if (event.message) {
            const { sender, recipient, message } = event;
            const userId = sender.id; // messenger user id
            const botId = recipient.id; // page id
            console.log('MessengerAdapter.handleMessage', userId, botId, JSON.stringify(message));

            // init user if necessary
            await this.bot.brain.initUserIfNecessary(userId);

            if (message.text) {
              const userMessage = Messages.getUserTextMessage(botId, userId, message.text);
              await this.bot.sendResponse(userMessage);
            }
          } else {
            console.log('MessengerAdapter.handleMessage: received unknown event: ', event);
          }
        });
      });
      res.sendStatus(200);
    }
  }

  /**
   * Prepare messenger post request
   * @param {Object} botMessage
   * @returns {Promise}
   */
  async sendText(botMessage) {
    console.log('MessengerAdapter.sendText', botMessage);
    const body = {
      recipient: {
        id: botMessage.userId,
      },
      message: {
        text: botMessage.payload,
      },
    };
    console.log('MessengerAdapter.sendText: body', body);
    const requestOptions = Object.assign(this.requestOptions, { body });
    await this.sendResponse(requestOptions);
  }
}

module.exports = MessengerAdapter;
