const logger = require('logtown')('MessengerAdapter');
const { PostbackMessage, UserImageMessage, UserTextMessage } = require('../messages');
const WebAdapter = require('./web_adapter');

const uri = 'https://graph.facebook.com/v2.6/me/messages';
const qs = { access_token: process.env.FB_PAGE_ACCESS_TOKEN || '' };

/**
 * BotfuelAdapter
 * @class
 * @classdesc Messenger adapter
 * @extends WebAdapter
 * @param {string|number} botId - the bot id
 * @param {object} config - the bot config
 */
class MessengerAdapter extends WebAdapter {
  /**
   * add extra route for this adapter
   * @override
   * @param app - the express app
   */
  createRoutes(app) {
    logger.debug('createRoutes');
    super.createRoutes(app);
    app.get('/webhook', (req, res) => this.validateWebhook(req, res));
  }

  /**
   * Handler for validating messenger webhook
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   */
  async validateWebhook(req, res) {
    logger.debug('validateWebhook');
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
      logger.debug('validateWebhook: OK!');
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error('validateWebhook: KO!');
      res.sendStatus(403);
    }
  }

  /**
   * Handler for messenger webhook post request
   * @async
   * @param {object} req - the request object
   * @param {object} res - the response object
   */
  async handleMessage(req, res) {
    logger.debug('handleMessage');
    const data = req.body;
    if (data.object === 'page') {
      data.entry.forEach((entry) => {
        entry.messaging.forEach(async (event) => {
          logger.debug('handleMessage: event', JSON.stringify(event));
          await this.processEvent(event);
        });
      });
      res.sendStatus(200);
    }
  }

  /**
   * Process received event (message, postback ...)
   * @async
   * @param {object} event - the messenger event
   */
  async processEvent(event) {
    const { sender, recipient } = event;
    const userId = sender.id; // messenger user id
    const botId = recipient.id; // page id
    logger.debug('processEvent', userId, botId, JSON.stringify(event));
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
   * send message to messenger for each bot messages
   * @async
   * @param {object[]} botMessages - the bot messages
   */
  async send(botMessages) {
    logger.debug('send', botMessages);
    for (const botMessage of botMessages) {
      const message = this.adapt(botMessage);
      logger.debug('send: message', message);
      // eslint-disable-next-line no-await-in-loop
      await this.postResponse({
        uri,
        qs,
        body: { recipient: { id: botMessage.user }, message },
      });
    }
  }

  /**
   * Adapt payload to send text
   * @param {object} payload - the payload
   * @return {object} the text
   */
  adaptText(payload) {
    return {
      text: payload.value,
    };
  }

  /**
   * Adapt payload to send quickreplies
   * @param {object} payload - the payload
   * @return {object} the quickreplies
   */
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

  /**
   * Adapt payload to send image
   * @param {object} payload - the payload
   * @return {object} the image
   */
  adaptImage(payload) {
    return {
      attachment: {
        type: 'image',
        payload: { url: payload.value },
      },
    };
  }

  /**
   * Adapt payload to send actions
   * @param {object} payload - the payload
   * @return {object} the actions
   */
  adaptActions(payload) {
    logger.debug('adaptActions', payload);
    const text = 'Actions' || payload.options.text; // TODO: fix this
    const buttons = payload.value.map(MessengerAdapter.adaptAction);
    return {
      attachment: {
        type: 'template',
        payload: { template_type: 'button', text, buttons },
      },
    };
  }

  /**
   * Adapt payload to send cards
   * @param {object} payload - the payload
   * @return {object} the cards
   */
  adaptCards(payload) {
    logger.debug('adaptCards', payload);
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

  /**
   * Adapt payload to send specific message type
   * @param {object} botMessage - the bot message
   * @return {object} the adapted message
   */
  adapt(botMessage) {
    logger.debug('adapt', botMessage);
    const payload = botMessage.payload;
    switch (botMessage.type) {
      case 'text':
        return this.adaptText(payload);
      case 'quickreplies':
        return this.adaptQuickreplies(payload);
      case 'image':
        return this.adaptImage(payload);
      case 'actions':
        return this.adaptActions(payload);
      case 'cards':
        return this.adaptCards(payload);
      default:
        return null;
    }
  }

  /**
   * Adapt an action item to messenger (button, link ...)
   * @static
   * @param {object} action - the action object
   * @return {object} the adapted action
   */
  static adaptAction(action) {
    logger.debug('adaptAction', action);
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
