'use strict';

const { CorpusExtractor, FileCorpus } = require('botfuel-dialog');

class TransmissionExtractor extends CorpusExtractor {
  constructor() {
    super({
      dimension: 'transmission',
      corpus: new FileCorpus(`${__dirname}/../corpora/transmission.txt`),
      options: {},
    });
  }
}

module.exports = TransmissionExtractor;
