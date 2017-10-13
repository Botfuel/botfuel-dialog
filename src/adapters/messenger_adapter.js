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
        userMessage = new UserImageMessage(botId, userId, message.attachments[0].payload).toJson();
      } else {
        userMessage = new UserTextMessage(botId, userId, message.text).toJson();
      }
    } else if (event.postback) {
      userMessage = new PostbackMessage(botId, userId, JSON.parse(event.postback.payload)).toJson();
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
  async send(botMessage) {
    console.log('MessengerAdapter.send', botMessage);
    await this.postResponse({
      uri,
      qs,
      body: this.adapt(botMessage),
    });
  }

  adapt(botMessage) {
    console.log('MessengerAdapter.sendActions', botMessage);
    if (botMessage.type === 'text') {
      return MessengerAdapter.Text(botMessage);
    }
    if (botMessage.type === 'actions') {
      return MessengerAdapter.Actions(botMessage);
    }
    if (botMessage.type === 'quickreplies') {
      return MessengerAdapter.Quickreplies(botMessage);
    }
    if (botMessage.type === 'cards') {
      return MessengerAdapter.Cards(botMessage);
    }
    if (botMessage.type === 'image') {
      return MessengerAdapter.Image(botMessage);
    }
    return null;
  }

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
