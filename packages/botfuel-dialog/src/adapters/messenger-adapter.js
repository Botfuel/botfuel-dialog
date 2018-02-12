/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const uuidv1 = require('uuid/v1');
const rp = require('request-promise-native');
const logger = require('logtown')('MessengerAdapter');
const PostbackMessage = require('../messages/postback-message');
const UserImageMessage = require('../messages/user-image-message');
const UserTextMessage = require('../messages/user-text-message');
const WebAdapter = require('./web-adapter');

const FB_GRAPH_URL = 'https://graph.facebook.com/v2.6';

/**
 * Adapter for the Facebook Messenger messaging platform.
 * @extends WebAdapter
 */
class MessengerAdapter extends WebAdapter {
  /** @inheritDoc */
  createRoutes(app) {
    logger.debug('createRoutes');
    super.createRoutes(app);
    app.get('/webhook', (req, res) => this.validateWebhook(req, res));
  }

  /**
   * Webhook used by Facebook Messenger to validate the bot.
   * @async
   * @private
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @returns {Promise.<void>}
   */
  async validateWebhook(req, res) {
    logger.debug('validateWebhook');
    if (
      req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN
    ) {
      logger.debug('validateWebhook: OK!');
      res.status(200).send(req.query['hub.challenge']);
    } else {
      logger.error('validateWebhook: KO!');
      res.sendStatus(403);
    }
  }

  /** @inheritDoc */
  async handleRequest(req, res) {
    logger.debug('handleRequest', req.body);
    const { object, entry } = req.body;
    if (object === 'page') {
      entry.forEach((entryItem) => {
        entryItem.messaging.forEach(async (event) => {
          await this.processEvent(event);
        });
      });
      res.sendStatus(200);
    }
  }

  /**
   * Processes a received event (message, postback, ...).
   * @async
   * @param {Object} event - the messenger event
   * @returns {Promise.<void>}
   */
  async processEvent(event) {
    logger.debug('processEvent', JSON.stringify(event));
    const { sender, message, postback } = event;
    let userMessage = null;
    if (message) {
      const { text, attachments } = message;
      // user send attachments
      if (attachments && attachments[0].type === 'image') {
        userMessage = new UserImageMessage(attachments[0].payload);
      } else {
        userMessage = new UserTextMessage(text);
      }
    } else if (postback) {
      const { dialog, entities } = JSON.parse(postback.payload);
      userMessage = new PostbackMessage(dialog, entities);
    }
    await this.handleMessage(userMessage.toJson(sender.id));
  }

  /** @inheritDoc */
  async initUserIfNecessary(userId) {
    await super.initUserIfNecessary(userId);
    await this.updateUserProfile(userId);
  }

  /** @inheritDoc */
  getUri() {
    return `${FB_GRAPH_URL}/me/messages`;
  }

  /** @inheritDoc */
  getQs() {
    return {
      access_token: process.env.FB_PAGE_ACCESS_TOKEN,
    };
  }

  /** @inheritDoc */
  getBody(botMessage) {
    const message = this.adapt(botMessage);
    return {
      recipient: {
        id: botMessage.user,
      },
      message,
    };
  }

  /**
   * @private
   * @param {Object} payload - the payload
   * @returns {Object} the text
   */
  adaptText(payload) {
    return {
      text: payload.value,
    };
  }

  /**
   * @private
   * @param {Object} payload - the payload
   * @returns {Object} the quickreplies
   */
  adaptQuickreplies(payload) {
    return {
      text: payload.options.text,
      quick_replies: payload.value.map(qr => ({
        content_type: 'text',
        title: qr,
        payload: qr,
      })),
    };
  }

  /**
   * @private
   * @param {Object} payload - the payload
   * @returns {Object} the image
   */
  adaptImage(payload) {
    return {
      attachment: {
        type: 'image',
        payload: {
          url: payload.value,
        },
      },
    };
  }

  /**
   * @private
   * @param {Object} payload - the payload
   * @returns {Object} the actions
   */
  adaptActions(payload) {
    logger.debug('adaptActions', payload);
    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: payload.options.text,
          buttons: payload.value.map(MessengerAdapter.adaptAction),
        },
      },
    };
  }

  /**
   * @private
   * @param {Object} payload - the payload
   * @returns {Object} the cards
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
        payload: {
          template_type: 'generic',
          elements,
        },
      },
    };
  }

  /**
   * Adapts payload.
   * @private
   * @param {Object} botMessage - the bot message
   * @returns {Object} the adapted message
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
   * @private
   * @static
   * @param {Object} action - the action object
   * @returns {Object|null} the adapted action or null if action type is not valid
   */
  static adaptAction(action) {
    logger.debug('adaptAction', action);
    switch (action.type) {
      case 'postback':
        return {
          type: 'postback',
          title: action.text,
          payload: JSON.stringify(action.value),
        };
      case 'link':
        return {
          type: 'web_url',
          title: action.text,
          url: action.value,
        };
      default:
        return null;
    }
  }

  /**
   * Get user profile informations and store it into the brain
   * @param {String} userId - the user id
   * @returns {void}
   */
  async updateUserProfile(userId) {
    logger.debug('updateUserProfile', userId);
    // check for user profile informations
    const userProfile = await this.bot.brain.userGet(userId, 'profile');
    // if not profile informations then get user profile
    if (!userProfile || !Object.keys(userProfile).length) {
      try {
        const res = await rp({
          method: 'GET',
          json: true,
          uri: `${FB_GRAPH_URL}/${userId}`,
          qs: {
            fields: 'first_name,last_name,gender',
            access_token: process.env.FB_PAGE_ACCESS_TOKEN,
          },
        }).promise();
        const profile = {
          firstName: res.first_name,
          lastName: res.last_name,
          gender: res.gender,
        };
        await this.bot.brain.userSet(userId, 'profile', profile);
        logger.debug('updateUserProfile: user profile updated with', profile);
      } catch (error) {
        logger.error('updateUserProfile: error', error.message || error.error || error);
      }
    }
  }

  /** @inheritDoc */
  addProperties(message) {
    return extend(
      {
        id: uuidv1(),
        channel: 'messenger',
        timestamp: Date.now(),
      },
      message,
    );
  }
}

module.exports = MessengerAdapter;
