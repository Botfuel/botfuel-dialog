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

const validUrl = require('valid-url');
const MessageError = require('../errors/message-error');
const MissingImplementationError = require('../errors/missing-implementation-error');

// @flow

/**
 * An object that can be validated.
 */
class ValidObject {
  /**
   * Validate the object.
   */
  validate(): void {
    throw new MissingImplementationError();
  }

  /**
   * Validate that a value is a string.
   * @param name - the type of the object being validated
   * @param value - the value being validated
   */
  validateString(name: string, value: any): void {
    if (!(typeof value === 'string')) {
      throw new MessageError({
        name,
        message: `'${value}' should be a string`,
      });
    }
  }

  /**
   * Validate that a value is a url.
   * @param name - the type of the object being validated
   * @param value - the value being validated
   */
  validateUrl(name: string, value: any): void {
    if (!validUrl.isUri(value)) {
      throw new MessageError({
        name,
        message: `'${value}' should be a url`,
      });
    }
  }

  /**
   * Validate that a value is an array
   * @param name - the type of the object being validated
   * @param value - the value being validated
   */
  validateArray(name: string, value: any): void {
    if (!Array.isArray(value)) {
      throw new MessageError({
        name,
        message: `'${value}' should be an array`,
      });
    }
  }
}

module.exports = ValidObject;
