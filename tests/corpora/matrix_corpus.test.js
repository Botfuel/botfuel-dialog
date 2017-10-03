/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const Corpus = require('../../src/corpora/corpus');
const MatrixCorpus = require('../../src/corpora/matrix_corpus');

describe('MatrixCorpus', function () {
  it('should properly handle case sensitive option', function () {
    expect(Corpus.matches('a', 'A', { caseSensitive: true })).to.be(false);
    expect(Corpus.matches('a', 'A')).to.be(true);
  });

  it('should properly normalize', function () {
    expect(Corpus.normalize('A  é l\'a c-b', { caseSensitive: true })).to.be('A e l a c b');
    expect(Corpus.normalize('A  é l\'a c-b', { keepQuotes: true })).to.be('a e l\'a c b');
    expect(Corpus.normalize('A  é l\'a c-b', { keepDashes: true })).to.be('a e l a c-b');
    expect(Corpus.normalize('A  é l\'a c-b', { keepAccents: true })).to.be('a é l a c b');
  });

  it('should return the correct words', function () {
    const corpus = new MatrixCorpus([
      ['a', 'b'],
      ['c', 'd'],
    ]);
    expect(corpus.getWords()).to.eql(['a', 'b', 'c', 'd']);
  });

  it('should retrieve the correct values', function () {
    const corpus = new MatrixCorpus([
      ['Paris Saint-Germain', 'Paris SG', 'PSG'],
      ['Olympique Lyonnais', 'L\'Olympique Lyonnais', 'OL'],
      ['Football Club de Nantes', 'FCN'],
      ['Guégan'],
    ]);
    expect(corpus.getValue('PSG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris  SG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('PARIS SG', { caseSensitive: true })).to.not.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain')).to.be('Paris Saint-Germain');
    expect(corpus.getValue('Paris Saint Germain', { keepDashes: true })).to.not.be('Paris Saint-Germain');
    expect(corpus.getValue('L Olympique Lyonnais')).to.be('Olympique Lyonnais');
    expect(corpus.getValue('L Olympique Lyonnais', { keepQuotes: true })).to.not.be('Olympique Lyonnais');
    expect(corpus.getValue('Guegan')).to.be('Guégan');
    expect(corpus.getValue('Guegan', { keepAccents: true })).to.not.be('Guégan');
  });
});
