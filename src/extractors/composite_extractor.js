const logger = require('logtown')('CompositeExtractor');

/**
 * Composite extractor
 */
class CompositeExtractor {
  /**
   * @constructor
   * @param {Object[]} extractors - the extractors
   */
  constructor(extractors) {
    logger.debug('constructor', extractors);
    this.extractors = extractors;
  }

  /**
   * Extracts the entities by applying extractors defined at the bot level.
   * @param {String} sentence - the sentence
   * @returns {Promise.<Object[]>}
   */
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
