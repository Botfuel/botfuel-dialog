const Messages = require('../messages');
const WebAdapter = require('./web_adapter');

const uri = 'https://graph.facebook.com/v2.6/me/messages';
const qs = { access_token: process.env.FB_PAGE_ACCESS_TOKEN || '' };

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
          console.log('MessengerAdapter.handleMessage: event', JSON.stringify(event));
          await this.processEvent(event);
        });
      });
      res.sendStatus(200);
    }
  }

  /**
   * Process received event (message, postback ...)
   * @param {Object} event
   * @returns {Promise}
   */
  async processEvent(event) {
    const { sender, recipient } = event;
    const userId = sender.id; // messenger user id
    const botId = recipient.id; // page id
    console.log('MessengerAdapter.processEvent', userId, botId, JSON.stringify(event));

    // init user if necessary
    await this.bot.brain.initUserIfNecessary(userId);

    // set userMessage
    let userMessage = null;
    if (event.message) {
      const message = event.message;
      const value = { text: message.text };
      if (message.quick_replies) {
        value.quick_reply_payload = message.quick_replies.payload;
      }
      userMessage = Messages.userText(botId, userId, value);
    } else if (event.postback) {
      const postback = event.postback;
      userMessage = Messages.userPostback(botId, userId, postback);
    } else {
      console.log('MessengerAdapter.ProcessEvent: unknown event', JSON.stringify(event));
    }

    await this.bot.sendResponse(userMessage);
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
        text: botMessage.payload.value,
      },
    };
    console.log('MessengerAdapter.sendText: body', body);
    await this.sendResponse({ uri, qs, body });
  }

  /**
   * Prepare messenger post request
   * @param {Object} botMessage
   * @returns {Promise}
   */
  async sendPostback(botMessage) {
    console.log('MessengerAdapter.sendPostback', botMessage);
    const body = {
      recipient: {
        id: botMessage.userId,
      },
      postback: {
        title: 'cta',
        payload: 'payload',
        referral: {
          ref: 'user referral param',
          source: 'shortlink',
          type: 'OPEN_THREAD',
        },
      },
    };
    console.log('MessengerAdapter.sendPostback: body', body);
    await this.sendResponse({ uri, qs, body });
  }

  async sendQuickReplies(botMessage) {
    console.log('MessengerAdapter.sendQuickReplies', botMessage);
    const body = {
      message: {
        text: 'quick reply',
        quick_replies: [
          {
            content_type: 'text',
            title: 'quick reply',
            payload: 'payload',
          },
        ],
      },
    };
    console.log('MessengerAdapter.sendQuickReplies: body', body);
    await this.sendResponse({ uri, qs, body });
  }
}

module.exports = MessengerAdapter;
