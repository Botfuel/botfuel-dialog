const PostbackMessage = require('../views/parts/postback_message');
const UserImageMessage = require('../views/parts/user_image_message');
const UserTextMessage = require('../views/parts/user_text_message');
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
      // user send attachments
      if (message.attachments && message.attachments[0].type === 'image') {
        userMessage = new UserImageMessage(botId, userId, message.attachments[0].payload);
      } else {
        userMessage = new UserTextMessage(botId, userId, message.text);
      }
    } else if (event.postback) {
      const payload = JSON.parse(event.postback.payload);
      userMessage = new PostbackMessage(botId, userId, payload.dialog, payload.entities);
    }
    await this.bot.sendResponse(userMessage.toJson());
  }

  /**
   * @param {Object} botMessages
   * @returns {Promise}
   */
  async send(botMessages) {
    console.log('MessengerAdapter.send', botMessages);
    for (const botMessage of botMessages) {
      const message = this.adapt(botMessage);
      console.log('MessengerAdapter.send: message', message);
      await this.postResponse({
        uri,
        qs,
        body: { recipient: { id: botMessage.user }, message },
      });
    }
  }

  adaptText(payload) {
    return {
      text: payload.value,
    };
  }

  adaptQuickreplies(payload) {
    return {
      text: 'Quick replies' || payload.options.text, // TODO: fix this
      quick_replies: payload.value.map(qr => ({
        content_type: 'text',
        title: qr,
        payload: qr,
      })),
    };
  }

  adaptImage(payload) {
    return {
      attachment: {
        type: 'image',
        payload: { url: payload.value },
      },
    };
  }

  adaptActions(payload) {
    console.log('MessengerAdapter.adaptActions', payload);
    const text = 'Actions' || payload.options.text; // TODO: fix this
    const buttons = payload.value.map(MessengerAdapter.adaptAction);
    return {
      attachment: {
        type: 'template',
        payload: { template_type: 'button', text, buttons },
      },
    };
  }

  adaptCards(payload) {
    console.log('MessengerAdapter.adaptCards', payload);
    const elements = payload.value.map((card) => {
      const buttons = card.buttons.map(MessengerAdapter.adaptAction);
      return Object.assign(card, { buttons });
    });
    return {
      attachment: {
        type: 'template',
        payload: { template_type: 'generic', elements },
      },
    };
  }

  adapt(botMessage) {
    console.log('MessengerAdapter.adapt', botMessage);
    const payload = botMessage.payload;
    if (botMessage.type === 'text') {
      return this.adaptText(payload);
    }
    if (botMessage.type === 'quickreplies') {
      return this.adaptQuickreplies(payload);
    }
    if (botMessage.type === 'image') {
      return this.adaptImage(payload);
    }
    if (botMessage.type === 'actions') {
      return this.adaptActions(payload);
    }
    if (botMessage.type === 'cards') {
      return this.adaptCards(payload);
    }
    return null;
  }


  static adaptAction(action) {
    console.log('MessengerAdapter.adaptAction', action);
    if (action.type === 'postback') {
      return {
        type: 'postback',
        title: action.text,
        payload: JSON.stringify(action.value),
      };
    }
    if (action.type === 'link') {
      return {
        type: 'web_url',
        title: action.text,
        url: action.value,
      };
    }
    return null;
  }
}

module.exports = MessengerAdapter;
