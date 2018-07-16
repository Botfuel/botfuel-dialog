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
const { checkCredentials } = require('../../src/utils/environment');
const { defaultConfig } = require('../../src/config');
const MissingCredentialsError = require('../../src/errors/missing-credentials-error');

const buildConfig = configPart => Object.assign({}, defaultConfig, configPart);

describe('Environment utils', () => {
  const sandbox = sinon.sandbox.create();

  afterAll(() => {
    sandbox.restore();
  });

  describe('When BOTFUEL_APP_TOKEN, BOTFUEL_APP_KEY, BOTFUEL_APP_ID are defined', () => {
    test('should not throw an error when using botfuel nlu', async () => {
      const config = buildConfig({ nlu: { name: 'botfuel' } });
      expect(() => checkCredentials(config)).not.toThrowError(MissingCredentialsError);
    });
  });

  describe('When BOTFUEL_APP_TOKEN is not defined', () => {
    beforeEach(() => {
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_TOKEN: undefined });
    });

    test('should throw an error when using botfuel adapter', async () => {
      const config = buildConfig({ adapter: { name: 'botfuel' } });
      const f = () => checkCredentials(config);
      expect(f).toThrowError(MissingCredentialsError);
    });

    test('should throw an error when using mongo brain', async () => {
      const config = buildConfig({ brain: { name: 'mongo' } });
      const f = () => checkCredentials(config);
      expect(f).toThrowError(MissingCredentialsError);
    });
  });

  describe('When BOTFUEL_APP_ID is not defined', () => {
    beforeEach(() => {
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_ID: undefined });
    });

    test('should throw an error when using botfuel nlu', async () => {
      const config = buildConfig({ nlu: { name: 'botfuel' } });
      expect(() => checkCredentials(config)).toThrowError(MissingCredentialsError);
    });

    test('should not throw an error when not using botfuel-nlu', async () => {
      const config = buildConfig({ nlu: { name: 'custom' } });
      expect(() => checkCredentials(config)).not.toThrowError(MissingCredentialsError);
    });
  });

  describe('When BOTFUEL_APP_KEY is not defined', () => {
    beforeEach(() => {
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_KEY: undefined });
    });

    test('should throw an error when using botfuel QnA', async () => {
      const config = buildConfig({ nlu: { name: 'botfuel', qna: true } });
      const f = () => checkCredentials(config);
      expect(f).toThrowError(MissingCredentialsError);
    });

    test('should not throw an error when not using botfuel-nlu', async () => {
      const config = buildConfig({ nlu: { name: 'custom' } });
      expect(() => checkCredentials(config)).not.toThrowError(MissingCredentialsError);
    });
  });
});
