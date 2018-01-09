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
const Card = require('./card');
const Message = require('./message');

/**
 * A message containing cards.
 * @extends Message
 */
class CardsMessage extends Message {
  /**
   * @constructor
   * @param {Object[]} cards - the cards array
   * @param {Object} [options] - the message options
   */
  constructor(cards, options) {
    super('cards', 'bot', cards, options);
    this.validate();
  }

  /** @inheritDoc */
  validate() {
    super.validate();
    this.validateArray('cards', this.value);
    for (const card of this.value) {
      if (card instanceof Card) {
        card.validate();
      } else {
        throw new MessageError({
          name: 'cards',
          message: `Object '${JSON.stringify(card)}' should be of type Card'`,
        });
      }
    }
  }

  /** @inheritDoc */
  valueAsJson() {
    return this.value.map(card => card.toJson());
  }
}

module.exports = CardsMessage;
