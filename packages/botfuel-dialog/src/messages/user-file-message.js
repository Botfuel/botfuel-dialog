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
 * A user message containing a file.
 * @extends Message
 */
class UserFileMessage extends Message {
  /**
   * @constructor
   * @param {String} url - the file url
   * @param {Object} [options] - the message options
   */
  constructor(url, options) {
    super('file', 'user', url, options);
    this.validate();
  }
  /** @inheritDoc */
  validate() {
    super.validate();
    this.validateUrl(this.type, this.value);
  }
}
module.exports = UserFileMessage;
