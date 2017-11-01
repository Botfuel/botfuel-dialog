const FileCorpus = require('../corpora/file_corpus');
const CorpusExtractor = require('./corpus_extractor');

/**
 * Extract boolean entities
 * @extends CorpusExtractor
 */
class BooleanExtractor extends CorpusExtractor {
  /**
   * @constructor
   * @param {object} parameters - the extractor parameters
   */
  constructor(parameters) {
    parameters.dimension = 'system:boolean';
    parameters.corpus = new FileCorpus(`${__dirname}/../corpora/boolean.${parameters.locale}.txt`);
    super(parameters);
  }

  /**
   * Get entity
   * @param {string} value - the entity value
   * @return {object} the entity
   */
  getEntity(value) {
    return { value: value === '1', type: 'boolean' };
  }
}

module.exports = BooleanExtractor;
