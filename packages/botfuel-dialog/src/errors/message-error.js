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

const SdkError = require('./sdk-error');

module.exports = class MessageError extends SdkError {
  /**
   * @constructor
   * @param {String} message - the error message
   * @param {String} name - the name of the message in error
   */
  constructor({ message, name }) {
    super(message || 'Unknown MessageError');
    this.name = name;
  }
};
