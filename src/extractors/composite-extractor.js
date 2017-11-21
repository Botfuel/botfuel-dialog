const logger = require('logtown')('CompositeExtractor');
const Extractor = require('./extractor');

/**
 * Composite extractor used for combining extractors.
 */
class CompositeExtractor extends Extractor {
  /**
   * @constructor
   * @param {Object[]} extractors - the extractors
   */
  constructor(extractors) {
    logger.debug('constructor', extractors);
    super();
    this.extractors = extractors;
  }

  // eslint-disable-next-line require-jsdoc
  async compute(sentence) {
    logger.debug('compute', sentence);
    let entities = [];
    for (const extractor of this.extractors) { // TODO: in parallel
      // eslint-disable-next-line no-await-in-loop
      const extractorEntities = await extractor.compute(sentence);
      entities = entities.concat(extractorEntities);
    }
    return entities;
  }
}

module.exports = CompositeExtractor;
