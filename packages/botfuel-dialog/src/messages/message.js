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

const ValidObject = require('./valid-object');

/**
 * An abstract message.
 */
class Message extends ValidObject {
  /**
   * @constructor
   * @param type - the message type
   * @param sender - the message sender, the bot or the user
   * @param value - the message value
   * @param options - the message options
   */
  constructor(type, sender, value, options) {
    super();
    this.type = type;
    this.sender = sender;
    this.value = value;
    this.options = options;
  }

  /**
   * Converts a message to json and adds to it the bot and user ids.
   * @param userId - the user id
   * @returns the json message
   */
  toJson(userId) {
    return {
      type: this.type,
      sender: this.sender,
      user: userId,
      payload: {
        value: this.valueAsJson(),
        options: this.options,
      },
    };
  }

  /**
   * Returns the value as json.
   * @returns the json value
   */
  valueAsJson() {
    return this.value;
  }

  validate() {
    this.validateString(this.type, this.type);
    this.validateString(this.type, this.sender);
  }
}

module.exports = Message;
