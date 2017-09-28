class Corpus {
  matches(key, word, options) {
    // caseSentitive = false
    // keepQuotes = false
    // keepAccents = false
    // keepSpaces = false
    // normalization regexp
    return key === word;
  }

  getValue(key, options) {
    for (const row of this.matrix) {
      for (const word of row) {
        if (this.matches(key, word, options)) {
          return word[0];
        }
      }
    }
    return null;
  }
}

module.exports = Corpus;
