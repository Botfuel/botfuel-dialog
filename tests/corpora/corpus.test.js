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

/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const Corpus = require('../../src/corpora/corpus');

describe('Corpus', function () {
  it('should properly normalize', function () {
    expect(Corpus.normalize('A  é l\'a c-b', { caseSensitive: true })).to.be('A e l a c b');
    expect(Corpus.normalize('A  é l\'a c-b', { keepQuotes: true })).to.be('a e l\'a c b');
    expect(Corpus.normalize('A  é l\'a c-b', { keepDashes: true })).to.be('a e l a c-b');
    expect(Corpus.normalize('A  é l\'a c-b', { keepAccents: true })).to.be('a é l a c b');
  });

  it('should retrieve the correct values', function () {
    const corpus = new Corpus([
      ['Paris Saint-Germain', 'Paris SG', 'PSG'],
      ['Olympique Lyonnais', 'L\'Olympique Lyonnais', 'OL'],
      ['Football Club de Nantes', 'FCN'],
      ['Montbéliard'],
    ]);
    expect(corpus.getValue('PSG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris  SG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG', { caseSensitive: true })).to.not.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain', { keepDashes: true })).to.not.be('Paris Saint-Germain');
    expect(corpus.getValue('L Olympique Lyonnais')).to.be('Olympique Lyonnais');
    expect(corpus.getValue('L Olympique Lyonnais', { keepQuotes: true })).to.not.be('Olympique Lyonnais');
    expect(corpus.getValue('Montbeliard')).to.be('Montbéliard');
    expect(corpus.getValue('Montbeliard', { keepAccents: true })).to.not.be('Montbéliard');
  });
});
