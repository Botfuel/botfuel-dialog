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
const Message = require('./message');

/**
 * A message made of actions.
 * @extends Message
 */
class ActionsMessage extends Message {
  // TODO: fix redundancy with card

  /**
   * @constructor
   * @param {Object[]} actions - the actions
   * @param {Object} [options] - the message options
   */
  constructor(actions, options) {
    super('actions', 'bot', actions, options);
    this.validate();
  }

  /** @inheritDoc */
  validate() {
    super.validate();
    this.validateActions(this.type, this.value);
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
          name: this.type,
          message: `Object '${JSON.stringify(action)}' should be of type Action'`,
        });
      }
    }
  }

  /** @inheritDoc */
  valueAsJson() {
    return this.value.map(action => action.toJson());
  }
}

module.exports = ActionsMessage;
