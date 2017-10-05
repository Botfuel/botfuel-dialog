const Diacritics = require('diacritics');

class Corpus {
  constructor() {
    this.matrix = null;
  }

  static normalize(sentence, options) {
    // console.log('Corpus.normalize', sentence, options);
    if (options === undefined || options.caseSensitive !== true) {
      sentence = sentence.toLowerCase();
    }
    if (options === undefined || options.keepQuotes !== true) {
      sentence = sentence.replace('\'', ' ');
    }
    if (options === undefined || options.keepDashes !== true) {
      sentence = sentence.replace('-', ' ');
    }
    if (options === undefined || options.keepAccents !== true) {
      sentence = Diacritics.remove(sentence);
    }
    return sentence.replace(/ {2,}/g, ' ');
  }

  static matches(key, word, options) {
    // console.log('Corpus.matches', key, word, options);
    return Corpus.normalize(key, options) === Corpus.normalize(word, options);
  }

  getValue(key, options) {
    // console.log('Corpus.getValue', key, options);
    for (const row of this.matrix) {
      for (const word of row) {
        if (Corpus.matches(key, word, options)) {
          return row[0];
        }
      }
    }
    return null;
  }

  getWords() {
    return this.matrix.reduce((s, t) => s.concat(t));
  }
}

module.exports = Corpus;
