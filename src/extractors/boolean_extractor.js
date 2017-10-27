const FileCorpus = require('../corpora/file_corpus');
const CorpusExtractor = require('./corpus_extractor');

const logger = require('logtown').getLogger('BooleanExtractor');

/**
 * Class for extracting entities.
 */
class BooleanExtractor extends CorpusExtractor {
  /**
   * Constructor.
   */
  constructor(parameters) {
    parameters.dimension = 'system:boolean';
    parameters.corpus = new FileCorpus(`${__dirname}/../corpora/boolean.${parameters.locale}.txt`);
    super(parameters);
  }

  getEntity(value) {
    return { value: value === '1', type: 'boolean' };
  }
}

module.exports = BooleanExtractor;
