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

const { defaultConfig, resolveConfigFile, getConfiguration } = require('../../src/config');

describe('Config', () => {
  test('should return the default configuration when none provided', () => {
    const emptyConfig = getConfiguration({});
    const noConfig = getConfiguration();

    expect(emptyConfig).toEqual(defaultConfig);
    expect(noConfig).toEqual(defaultConfig);
  });

  test('should return a valid configuration when qna provided', () => {
    const config = getConfiguration({ nlu: { qna: { when: 'before' } } });
    expect(config.nlu.qna.when).toEqual('before');
  });

  test('should return a valid configuration when spellchecking provided', () => {
    const config = getConfiguration({ nlu: { spellchecking: true } });
    expect(config.nlu.spellchecking).toEqual(true);
  });

  test('should return empty object when no config filename provided', () => {
    const resolved = resolveConfigFile();
    expect(resolved).toEqual({});
  });

  test('should have a custom property if provided', () => {
    const config = getConfiguration({ custom: { foo: 'bar' } });
    expect(config).toHaveProperty('custom');
    expect(config.custom).toEqual({ foo: 'bar' });
  });

  test('should throw an error when file not exists', () => {
    expect(() => resolveConfigFile('invalid')).toThrow();
  });
});
