const fs = require('fs');
const logger = require('logtown')('FileCorpus');
const Corpus = require('./corpus');

/**
 * Corpus from a file
 */
class FileCorpus extends Corpus {
  /**
   * @constructor
   * @param {String} path - the corpus path
   * @param {String} [separator=','] - the optional corpus row separator
   */
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
