const Messages = require('../messages');
const WebAdapter = require('./web_adapter');

/**
 * Messenger Adapter.
 */
class MessengerAdapter extends WebAdapter {
  /**
   * Override parent method to add extra route for this adapter
   * @param app
   */
  createRoutes(app) {
    console.log('MessengerAdapter.createRoutes');
    super.createRoutes(app);
    app.get('/webhook', (req, res) => this.validateWebhook(req, res));
  }

  /**
   * Handler for validating messenger webhook
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise}
   */
  async validateWebhook(req, res) {
    console.log('MessengerAdapter.validateWebhook');
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
      console.log('MessengerAdapter.validateWebhook: OK!');
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error('MessengerAdapter.validateWebhook: KO!');
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
    console.log('MessengerAdapter.handleMessage');
    const data = req.body;
    if (data.object === 'page') {
      data.entry.forEach((entry) => {
        entry.messaging.forEach(async (event) => {
          if (event.message) {
            await this.test(event);
          } else {
            console.log('MessengerAdapter.handleMessage: unknown event: ', event);
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
    const uri = 'https://graph.facebook.com/v2.6/me/messages';
    const qs = { access_token: process.env.FB_PAGE_ACCESS_TOKEN };
    await this.sendResponse({ uri, qs, body });
  }

  async test(event) {
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
  }
}

module.exports = MessengerAdapter;
