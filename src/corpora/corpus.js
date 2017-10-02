const Diacritics = require('diacritics');

class Corpus {
  static matches(key, word, options) {
    console.log('Corpus.matches', key, word, options);
    if (options === undefined || options.caseSensitive !== true) {
      key = key.toLowerCase();
      word = word.toLowerCase();
    }
    if (options === undefined || options.keepQuotes !== true) {
      key = key.replace('\'', ' ');
      word = word.replace('\'', ' ');
    }
    if (options === undefined || options.keepDashes !== true) {
      key = key.replace('-', ' ');
      word = word.replace('-', ' ');
    }
    if (options === undefined || options.keepAccents !== true) {
      key = Diacritics.remove(key);
      word = Diacritics.remove(word);
    }
    key = key.replace(/ {2,}/g, ' ');
    word = word.replace(/ {2,}/g, ' ');
    return key === word;
  }

  getValue(key, options) {
    console.log('Corpus.getValue', key, options);
    for (const row of this.matrix) {
      for (const word of row) {
        if (Corpus.matches(key, word, options)) {
          return row[0];
        }
      }
    }
    return null;
  }
}

module.exports = Corpus;
