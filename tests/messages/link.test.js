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

const Link = require('../../src/messages/link');
const MessageError = require('../../src/errors/message-error');

describe('Link', () => {
  test('should throw an exception when malformed url', async () => {
    // eslint-disable-next-line require-jsdoc
    function validateInvalidObject() {
      // eslint-disable-next-line no-new
      new Link('', null).validate();
    }
    expect(validateInvalidObject).toThrow(MessageError);
  });
});
