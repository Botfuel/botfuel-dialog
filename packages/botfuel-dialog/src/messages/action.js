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

const Part = require('./part');

/**
 * An action is a message part abstracting links and buttons.
 */
class Action extends Part {
  /**
   * @constructor
   * @param {String} type - the action type
   * @param {String} text - the text
   * @param {Object|*} value - the value
   */
  constructor(type, text, value) {
    super();
    this.type = type;
    this.text = text;
    this.value = value;
  }

  /** @inheritDoc */
  toJson() {
    return {
      type: this.type,
      text: this.text,
      value: this.value,
    };
  }

  /** @inheritDoc */
  validate() {
    this.validateString(this.type, this.text);
  }
}

module.exports = Action;
