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

const MessageError = require('../errors/message-error');
const Action = require('./action');
const Part = require('./part');

/**
 * A card part.
 */
class Card extends Part {
  /**
   * @constructor
   * @param {String} title - the title
   * @param {String} imageUrl - the image url
   * @param {Object[]} actions - an array of actions
   */
  constructor(title, imageUrl, actions) {
    super();
    this.title = title;
    this.imageUrl = imageUrl;
    this.actions = actions;
  }

  /** @inheritDoc */
  toJson() {
    // TODO : this is very Messenger specific, let's generalize it!
    return {
      title: this.title,
      image_url: this.imageUrl,
      buttons: this.actions.map(action => action.toJson()),
    };
  }

  /** @inheritDoc */
  validate() {
    this.validateString('card', this.title);
    this.validateUrl('card', this.imageUrl);
    this.validateActions('card', this.actions);
  }

  /**
   * Validates that a value is an array of actions.
   * @param {String} name - the type of the object being validated
   * @param {*} actions - the value being validated
   * @returns {void}
   */
  validateActions(name, actions) {
    this.validateArray(name, actions);
    for (const action of actions) {
      if (action instanceof Action) {
        action.validate();
      } else {
        throw new MessageError({
          name: 'card',
          message: `Object '${JSON.stringify(action)}' should be of type Action'`,
        });
      }
    }
  }
}

module.exports = Card;
