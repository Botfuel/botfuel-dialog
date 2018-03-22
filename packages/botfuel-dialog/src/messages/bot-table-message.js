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
const Message = require('./message');

/**
 * A table message sent by the bot to the user.
 * Only supported with botfuel-adapter
 * @extends Message
 */
class BotTableMessage extends Message {
  /**
   * @constructor
   * @param {Object} data - the table data. See explanation and example below.
   * @param {Object} [options] - the message options
   *
   * data = {schema: [], rows: []}
   * schema: array of { key: label } where label is the displayed title for the corresponding key
   * rows: array of objects with keys defined in schema
   * example:
   * data = {
   *    schema: [ {name: "Name"}, {city: "City"}],
   *    rows: [
   *        {name: "John", city: "New York"},
   *        {name: "Peter", city: "Paris"}
   *    ]
   * }
   */
  constructor(data, options) {
    super('table', 'bot', data, options);
    this.validate();
  }

  /** @inheritDoc */
  validate() {
    super.validate();
    if (!(this.value && this.value.schema && this.value.rows)) {
      throw new MessageError({
        name: 'data',
        message: 'A BotTableMessage data should have schema and rows properties.',
      });
    }

    this.validateArray('data.schema', this.value.schema);
    this.validateArray('data.rows', this.value.rows);
  }
}

module.exports = BotTableMessage;
