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

// @flow

import type { BotMessageJson } from '../messages/message';

const rp = require('request-promise-native');
const logger = require('logtown')('MessengerAdapter');
const PostbackMessage = require('../messages/postback-message');
const UserImageMessage = require('../messages/user-image-message');
const UserTextMessage = require('../messages/user-text-message');
const WebAdapter = require('./web-adapter');

const FB_GRAPH_URL = 'https://graph.facebook.com/v2.6';

type MessengerEvent = {
  sender: {
    id: string,
  },
  recipient: {
    id: string,
  },
  timestamp: number,
  message: {
    mid: string,
    seq: number,
    text: string,
    attachments: {
      type: string,
      payload: {
        coordinates: {
          lat: number,
          long: number,
        },
        url: string,
      }
    }[],
  },
  postback: {
    payload: string,
  },
};

type MessengerBody = {
  object: 'page',
  entry: {
    id: string,
    time: number,
    messaging: MessengerEvent[],
  }[],
};


/**
 * Adapter for the Facebook Messenger messaging platform.
 * @extends WebAdapter
 */
class MessengerAdapter extends WebAdapter {
  /** @inheritDoc */
  createRoutes(app: express$Application) {
    logger.debug('createRoutes');
    super.createRoutes(app);
    app.get('/webhook', (req: express$Request, res: express$Response) => this.validateWebhook(req, res));
  }

  /**
   * Webhook used by Facebook Messenger to validate the bot.
   * @private
   * @param req - the request object
   * @param res - the response object
   */
  async validateWebhook(
    req: express$Request,
    res: express$Response,
  ): Promise<void> {
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
  async handleRequest(
    req: express$Request,
    res: express$Response,
  ): Promise<void> {
    logger.debug('handleRequest', req.body);
    const messengerBody: MessengerBody = (req.body: any);
    const { object, entry } = messengerBody;
    if (object === 'page') {
      for (const entryItem of entry) {
        for (const event of entryItem.messaging) {
          await this.processEvent(event); // eslint-disable-line no-await-in-loop
        }
      }
      res.sendStatus(200);
    }
  }

  /**
   * Processes a received event (message, postback, ...).
   * @param event - the messenger event
   */
  async processEvent(event: MessengerEvent): Promise<void> {
    logger.debug('processEvent', JSON.stringify(event));
    const { sender, message, postback } = event;
    let userMessage = null;
    if (message) {
      const { text, attachments } = message;
      // user send attachments
      if (attachments && attachments[0].type === 'image') {
        userMessage = new UserImageMessage(attachments[0].payload.url);
      } else if (attachments && attachments[0].type === 'location') {
        const { lat, long } = attachments[0].payload.coordinates;
        userMessage = new UserTextMessage(`${lat}, ${long}`);
      } else {
        userMessage = new UserTextMessage(text);
      }
    } else if (postback) {
      const { dialog, entities } = JSON.parse(postback.payload);
      userMessage = new PostbackMessage(dialog, entities);
    }

    if (userMessage) {
      await this.handleMessage(userMessage.toJson(sender.id));
    }
  }

  /** @inheritDoc */
  async addUserIfNecessary(userId: string) {
    await super.addUserIfNecessary(userId);
    await this.updateUserProfile(userId);
  }

  /** @inheritDoc */
  getUrl() {
    return `${FB_GRAPH_URL}/me/messages`;
  }

  /** @inheritDoc */
  getQueryParameters() {
    return {
      access_token: process.env.FB_PAGE_ACCESS_TOKEN,
    };
  }

  /** @inheritDoc */
  getBody(botMessage: BotMessageJson) {
    const message = this.adapt(botMessage);
    return {
      messaging_type: 'RESPONSE',
      recipient: {
        id: botMessage.user,
      },
      message,
    };
  }

  /**
   * @private
   * @param payload - the payload
   * @returns the text
   */
  adaptText(payload: any) {
    return {
      text: payload.value,
    };
  }

  /**
   * @private
   * @param payload - the payload
   * @returns the quickreplies
   */
  adaptQuickreplies(payload: any) {
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
   * @param payload - the payload
   * @returns the image
   */
  adaptImage(payload: any) {
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
   * @param payload - the payload
   * @returns the actions
   */
  adaptActions(payload: any) {
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
   * @param payload - the payload
   * @returns the cards
   */
  adaptCards(payload: any) {
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
   * @param botMessage - the bot message
   * @returns the adapted message
   */
  adapt(botMessage: BotMessageJson) {
    logger.debug('adapt', botMessage);
    const { payload } = botMessage;
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
   * @param action - the action object
   * @returns the adapted action or null if action type is not valid
   */
  static adaptAction(action: any) {
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
   * Gets user profile informations and store it into the brain.
   * @param userId - the user id
   */
  async updateUserProfile(userId: string): Promise<void> {
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
}

module.exports = MessengerAdapter;
