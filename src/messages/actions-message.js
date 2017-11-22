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

const Message = require('./message');

/**
 * A message made of actions.
 * @extends Message
 */
class ActionsMessage extends Message {
  /**
   * @constructor
   * @param {Object[]} actions - the actions
   * @param {Object} options - the message options
   */
  constructor(actions, options) {
    super('actions', 'bot', actions, options);
  }

  // eslint-disable-next-line require-jsdoc
  valueAsJson() {
    return this.value.map(action => action.toJson());
  }
}

module.exports = ActionsMessage;
