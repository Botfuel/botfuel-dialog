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

const ValidObject = require('../../src/messages/valid-object');
const MessageError = require('../../src/errors/message-error');
const MissingImplementationError = require('../../src/errors/missing-implementation-error');

describe('ValidObject', () => {
  test('should throw a missing implementation error', () => {
    expect(() => new ValidObject().validate()).toThrow(MissingImplementationError);
  });

  describe('Should throw an message error when', () => {
    test('Array is not valid', () => {
      expect(() => new ValidObject().validateArray('quickreplies', '')).toThrow(MessageError);
    });

    test('String is not valid', () => {
      expect(() => new ValidObject().validateString('text', 123)).toThrow(MessageError);
    });

    test('Url is not valid', () => {
      expect(() => new ValidObject().validateUrl('link', '')).toThrow(MessageError);
    });
  });

  describe('Should not throw an message error when', () => {
    test('Array is valid', () => {
      expect(() => new ValidObject().validateArray('quickreplies', ['item'])).not.toThrow();
    });

    test('String is valid', () => {
      expect(() => new ValidObject().validateString('text', 'str')).not.toThrow();
    });

    test('Url is valid', () => {
      expect(() =>
        new ValidObject().validateUrl('link', 'https://www.botfuel.io/en')).not.toThrow();
    });
  });
});
