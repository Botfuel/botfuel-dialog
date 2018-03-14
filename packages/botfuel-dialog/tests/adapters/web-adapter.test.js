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

/* eslint-disable quotes */

const validUrl = require('valid-url');
const WebAdapter = require('../../src/adapters/web-adapter');

describe('WebAdapter', () => {
  test('should throw a missing implementation error', async () => {
    expect.assertions(1);
    try {
      await new WebAdapter({}).handleRequest();
    } catch (e) {
      expect(e.message).toEqual('Not implemented!');
    }
  });

  test('should resolve static url to a correct uri', async () => {
    expect(validUrl.isWebUri(WebAdapter.getStaticUrl('./images/picture.png'))).toBeDefined();
    expect(WebAdapter.getStaticUrl('./images/picture.png')).toEqual(
      'http://localhost:5000/static/images/picture.png',
    );

    expect(validUrl.isWebUri(WebAdapter.getStaticUrl('images/picture.png'))).toBeDefined();
    expect(WebAdapter.getStaticUrl('images/picture.png')).toEqual(
      'http://localhost:5000/static/images/picture.png',
    );
  });

  test('should resolve template image url to a correct uri', async () => {
    expect(validUrl.isWebUri(WebAdapter.getImageUrl('product.handlebars', {}))).toBeDefined();
  });
});
