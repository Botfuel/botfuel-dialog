const fs = require('fs');
const Corpus = require('./corpus');

const logger = require('logtown').getLogger('FileCorpus');

class FileCorpus extends Corpus {
  constructor(path, separator = ',') {
    logger.debug('constructor', path, separator);
    super(fs
          .readFileSync(path, 'utf8') // TODO: async?
          .toString()
          .split('\n')
          .slice(0, -1) // remove last empty line
          .map(row => row.split(separator)));
  }
}

module.exports = FileCorpus;
