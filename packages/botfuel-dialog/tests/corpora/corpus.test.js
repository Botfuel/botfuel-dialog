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

const Corpus = require('../../src/corpora/corpus');
const ExtractorError = require('../../src/errors/extractor-error');

describe('Corpus', () => {
  test('should properly normalize', () => {
    expect(Corpus.normalize("A  é l'a c-b", { caseSensitive: true })).toBe('A e l a c b');
    expect(Corpus.normalize("A  é l'a c-b", { keepQuotes: true })).toBe("a e l'a c b");
    expect(Corpus.normalize("A  é l'a c-b", { keepDashes: true })).toBe('a e l a c-b');
    expect(Corpus.normalize("A  é l'a c-b", { keepAccents: true })).toBe('a é l a c b');
  });

  test('should retrieve the correct values', () => {
    const corpus = new Corpus([
      ['Paris Saint-Germain', 'Paris SG', 'PSG'],
      ['Olympique Lyonnais', "L'Olympique Lyonnais", 'OL'],
      ['Football Club de Nantes', 'FCN'],
      ['Montbéliard'],
    ]);
    expect(corpus.getValue('PSG')).toBe('Paris Saint-Germain');
    expect(corpus.getValue('Paris  SG')).toBe('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG')).toBe('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG', { caseSensitive: true })).not.toBe('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain')).toBe('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain', { keepDashes: true })).not.toBe(
      'Paris Saint-Germain',
    );
    expect(corpus.getValue('L Olympique Lyonnais')).toBe('Olympique Lyonnais');
    expect(corpus.getValue('L Olympique Lyonnais', { keepQuotes: true })).not.toBe(
      'Olympique Lyonnais',
    );
    expect(corpus.getValue('Montbeliard')).toBe('Montbéliard');
    expect(corpus.getValue('Montbeliard', { keepAccents: true })).not.toBe('Montbéliard');
  });

  test('should throw an ExtractorError', () => {
    expect(() => new Corpus(
      [
        ['should', '', '', ''],
        ['Olympique Lyonnais', "L'Olympique Lyonnais", 'OL'],
        ['Football Club de Nantes', 'FCN'],
        ['Montbéliard'],
      ],
    )).toThrow(ExtractorError);
  });
});
