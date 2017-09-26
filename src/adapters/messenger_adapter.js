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
      const value = message.quick_reply ? message.quick_reply.payload : message.text;
      userMessage = Messages.userText(botId, userId, value);
    } else if (event.postback) {
      const postback = event.postback;
      userMessage = Messages.userPostback(botId, userId, JSON.parse(postback.payload));
    } else {
      console.log('MessengerAdapter.ProcessEvent: unknown event', JSON.stringify(event));
    }

    await this.bot.sendResponse(userMessage);
  }

  /**
   * Prepare messenger text message
   * @param {Object} botMessage
   * @returns {Promise}
   */
  async sendText(botMessage) {
    console.log('MessengerAdapter.sendText', botMessage);
    await this.postResponse({ uri, qs, body: MessengerAdapter.Text(botMessage) });
  }

  /**
   * Prepare messenger actions message
   * @param {Object} botMessage
   * @returns {Promise}
   */
  async sendActions(botMessage) {
    console.log('MessengerAdapter.sendActions', botMessage);
    await this.postResponse({ uri, qs, body: MessengerAdapter.Actions(botMessage) });
  }

  /**
   * Prepare messenger quick replies message
   * @param {Object} botMessage
   * @returns {Promise}
   */
  async sendQuickreplies(botMessage) {
    console.log('MessengerAdapter.sendQuickreplies', botMessage);
    if (!botMessage.payload.value.some(String)) {
      throw new Error('Only strings values are allowed for quick replies');
    }
    await this.postResponse({ uri, qs, body: MessengerAdapter.Quickreplies(botMessage) });
  }

  /**
   * Prepare messenger cards message
   * @param botMessage
   * @returns {Promise}
   */
  async sendCards(botMessage) {
    console.log('MessengerAdapter.sendCards', botMessage);
    await this.postResponse({ uri, qs, body: MessengerAdapter.Cards(botMessage) });
  }

  /**
   * Prepare messenger image message
   * @param botMessage
   * @returns {Promise}
   */
  async sendImage(botMessage) {
    console.log('MessengerAdapter.sendImage', botMessage);
    await this.postResponse({ uri, qs, body: MessengerAdapter.Image(botMessage) });
  }

  /**
   * Prepare text message body
   * @param {Object} botMessage
   * @returns {Object} the body
   * @constructor
   */
  static Text(botMessage) {
    console.log('MessengerAdapter.Text', botMessage);
    return {
      recipient: {
        id: botMessage.user,
      },
      message: {
        text: botMessage.payload.value,
      },
    };
  }

  /**
   * Prepare actions message body
   * @param {Object} botMessage
   * @returns {Object} the body
   * @constructor
   */
  static Actions(botMessage) {
    console.log('MessengerAdapter.Actions', botMessage);
    return {
      recipient: {
        id: botMessage.user,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: botMessage.payload.options.text || 'Actions',
            buttons: botMessage.payload.value.map(MessengerAdapter.ActionButton),
          },
        },
      },
    };
  }

  /**
   * Prepare action button
   * @param {Object} action
   * @returns {Object} the button
   * @constructor
   */
  static ActionButton(action) {
    console.log('MessengerAdapter.ActionButton', action);
    let button = null;
    // format button for messenger
    if (action.type === 'postback') {
      button = {
        type: 'postback',
        title: action.text || action.value,
        payload: JSON.stringify(action.value),
      };
    } else if (action.type === 'link') {
      button = {
        type: 'web_url',
        title: action.text,
        url: action.value,
      };
    }
    // return the button
    return button;
  }

  /**
   * Prepare quick replies message body
   * @param {Object} botMessage
   * @returns {Object} the body
   * @constructor
   */
  static Quickreplies(botMessage) {
    console.log('MessengerAdapter.Quickreplies', botMessage);
    // format quick replies for messenger
    const format = quickReply => ({
      content_type: 'text',
      title: quickReply,
      payload: quickReply,
    });
    // return the body
    return {
      recipient: {
        id: botMessage.user,
      },
      message: {
        text: botMessage.payload.options.text || 'Quick replies',
        quick_replies: botMessage.payload.value.map(format),
      },
    };
  }

  /**
   * Prepare cards message body
   * @param {Object} botMessage
   * @returns {Object} the body
   * @constructor
   */
  static Cards(botMessage) {
    console.log('MessengerAdapter.Cards', botMessage);
    // format actions buttons for messenger
    const format = element => (Object.assign(element, {
      buttons: element.buttons.map(MessengerAdapter.ActionButton),
    }));
    // return the body
    return {
      recipient: {
        id: botMessage.user,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: botMessage.payload.value.map(format),
          },
        },
      },
    };
  }

  /**
   * Prepare image message body
   * @param {Object} botMessage
   * @returns {Object} the body
   * @constructor
   */
  static Image(botMessage) {
    console.log('MessengerAdapter.Image', botMessage);
    // return the body
    return {
      recipient: {
        id: botMessage.user,
      },
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: botMessage.payload.value,
          },
        },
      },
    };
  }
}

module.exports = MessengerAdapter;
