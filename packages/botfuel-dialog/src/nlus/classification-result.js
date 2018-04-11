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

const logger = require('logtown')('Intent');
const SdkError = require('../errors/sdk-error');

/** ClassificationResult class */
class ClassificationResult {
  /**
   * @constructor
   * @param {Object} data data receive from trainer api request
   */
  constructor(data) {
    logger.debug('constructor');
    const { name, type, label, resolvePrompt } = data;

    if (!(name || label)) {
      throw new SdkError('Intent constructor: data must contain label or name');
    }

    this.type = this.getType(type);
    this.name = name;
    this.label = label;
    this.resolvePrompt = resolvePrompt;

    if (!this.name) {
      this.name = this.isQnA() ? 'qnas' : this.label;
    }

    if (this.isQnA()) {
      this.answers = data.answers;
    }
  }

  static TYPE_QNA = 'QnA';
  static TYPE_INTENT = 'Intent';

  /**
   * Parse type from data
   * @param {String} type type
   * @returns {String} static TYPE
   */
  getType(type) {
    if (!type) {
      throw new SdkError('Intent constructor: data must contain type');
    }

    if (type.toLowerCase() === 'intent') {
      return ClassificationResult.TYPE_INTENT;
    } else if (type.toLowerCase() === 'qna') {
      return ClassificationResult.TYPE_QNA;
    }
    throw new SdkError(`Intent constructor: invalid intent type: ${type}`);
  }

  /**
   * Returns true if intent is QnA
   * @returns {boolean}
   */
  isQnA() {
    return this.type === ClassificationResult.TYPE_QNA;
  }
}

module.exports = ClassificationResult;
