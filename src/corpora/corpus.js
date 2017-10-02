const Diacritics = require('diacritics');

class Corpus {
  matches(key, word, options) {
    if (options !== undefined) {
      if (options.caseSentitive === false) {
        key = key.toLowerCase();
        word = word.toLowerCase();
      }
      if (options.keepQuotes === false) {
        key = key.replace('\'', ' ');
        word = word.replace('\'', ' ');
      }
      if (options.keepDashes === false) {
        key = key.replace('-', ' ');
        word = word.replace('-', ' ');
      }
      if (options.keepAccents === false) {
        key = Diacritics.remove(key);
        word = Diacritics.remove(word);
      }
    }
    key = key.replace(/ {2,}/g, ' ');
    word = word.replace(/ {2,}/g, ' ');
    return key === word;
  }

  getValue(key, options) {
    for (const row of this.matrix) {
      for (const word of row) {
        if (this.matches(key, word, options)) {
          return row[0];
        }
      }
    }
    return null;
  }
}

module.exports = Corpus;
