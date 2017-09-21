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
      const value = message.text;
      let options = null;
      if (message.quick_replies) {
        // @TODO move this in value when handling payload as an object in Messages
        options = message.quick_replies;
      }
      userMessage = Messages.userText(botId, userId, value, options);
    } else if (event.postback) {
      const postback = event.postback;
      userMessage = Messages.userPostback(botId, userId, postback);
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
    const body = {
      recipient: {
        id: botMessage.user,
      },
      message: {
        text: botMessage.payload.value,
      },
    };
    console.log('MessengerAdapter.sendText: body', body);
    await this.sendResponse({ uri, qs, body });
  }

  /**
   * Prepare messenger actions message
   * @param {Object} botMessage
   * @returns {Promise}
   */
  async sendActions(botMessage) {
    console.log('MessengerAdapter.sendActions', botMessage);
    // define actions type
    let actionType = null;
    for (const action in botMessage.payload.value) {
      if (actionType === null) {
        actionType = action.type;
      } else if (actionType !== action.type) {
        throw new Error('Actions items don\'t have the same type');
      }
    }
    // make body
    let body;
    switch (actionType) {
      case 'link':
        body = this.makeLinkButtons(botMessage);
        break;
      case 'postback':
        body = this.makePostbackButtons(botMessage);
        break;
      case 'text':
      default:
        body = this.makeQuickReplies(botMessage);
    }
    // send response
    console.log('MessengerAdapter.sendActions: body', body);
    await this.sendResponse({ uri, qs, body });
  }

  /**
   * Prepare links buttons message body
   * @param {Object} botMessage
   * @returns {Object} the body
   */
  async makeLinkButtons(botMessage) {
    console.log('MessengerAdapter.makeLinks', botMessage);
    // format link buttons for messenger
    const buttons = [];
    botMessage.payload.value.forEach((button) => {
      buttons.push({
        type: 'web_url',
        title: button.text,
        url: button.value,
      });
    });
    // return the body
    return {
      recipient: {
        id: botMessage.user,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Links buttons',
            buttons,
          },
        },
      },
    };
  }

  /**
   * Prepare postback message body
   * @param {Object} botMessage
   * @returns {Object} the body
   */
  async makePostbackButtons(botMessage) {
    console.log('MessengerAdapter.sendPostback', botMessage);
    // format postback buttons for messenger
    const buttons = [];
    botMessage.payload.value.forEach((button) => {
      buttons.push({
        type: 'postback',
        title: button.text,
        payload: button.value,
      });
    });
    // return the body
    return {
      recipient: {
        id: botMessage.user,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Postback buttons',
            buttons,
          },
        },
      },
    };
  }

  /**
   * Prepare quick replies message body
   * @param botMessage
   * @returns {Object} the body
   */
  async makeQuickReplies(botMessage) {
    console.log('MessengerAdapter.sendQuickReplies', botMessage);
    // format quick replies for messenger
    const quickReplies = [];
    botMessage.payload.value.forEach((quickReply) => {
      quickReplies.push({
        content_type: quickReply.type,
        title: quickReply.text,
        payload: quickReply.value,
      });
    });
    // return the body
    return {
      recipient: {
        id: botMessage.user,
      },
      message: {
        text: 'quick replies',
        quick_replies: quickReplies,
      },
    };
  }
}

module.exports = MessengerAdapter;
