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

const sinon = require('sinon');
const WsExtractor = require('../../src/extractors/ws-extractor');
const MissingCredentialsError = require('../../src/errors/missing-credentials-error');

describe('WsExtractor', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  test('should properly extract', async () => {
    const extractor = new WsExtractor({ locale: 'en' });
    const entities = await extractor.compute('I leave from Paris');
    expect(entities[0].dim).toBe('city');
    expect(entities[0]).toHaveProperty('body');
    expect(entities[0].values[0].type).toBe('string');
    expect(entities[0].values[0].value).toBe('Paris');
    expect(entities[0].start).toBe(8);
    expect(entities[0].end).toBe(18);
  });

  test('should throw an error when missing credentials', async () => {
    sandbox.stub(process, 'env').value({ BOTFUEL_APP_ID: undefined });
    expect(() => new WsExtractor({ locale: 'en' })).toThrow(MissingCredentialsError);
  });

  test('should throw an error when not valid credentials', async () => {
    expect.assertions(1);
    sandbox.stub(process, 'env').value({ BOTFUEL_APP_ID: 'FakeId', BOTFUEL_APP_KEY: 'FakeKey' });
    try {
      await new WsExtractor({ locale: 'en' }).compute('I leave from London');
    } catch (e) {
      expect(e.message).toMatch('Could not authenticate!');
    }
  });
});
