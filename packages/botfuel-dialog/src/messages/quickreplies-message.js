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

const Message = require('./message');

/**
 * A message containing quick replies.
 * @extends Message
 */
class QuickrepliesMessage extends Message {
  value: string[];

  /**
   * @constructor
   * @param texts - the array of texts
   * @param options - the message options
   */
  constructor(texts: string[], options?: {}) {
    super('quickreplies', 'bot', texts, options);
    this.validate();
  }

  /** @inheritDoc */
  validate() {
    super.validate();
    this.validateArray(this.type, this.value);
    for (const text of this.value) {
      this.validateString(this.type, text);
    }
  }
}

module.exports = QuickrepliesMessage;
