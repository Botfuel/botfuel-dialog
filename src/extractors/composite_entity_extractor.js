/**
 * Class for extracting entities.
 */
class CompositeEntityExtractor {
  /**
   * Constructor.
   */
  constructor(extractors) {
    console.log('CompositeEntityExtractor.constructor', extractors);
    this.extractors = extractors;
  }

  /**
   * Extracts the entities by applying extractors defined at the bot level.
   * @param {string} sentence the sentence
   */
  async compute(sentence) {
    console.log('CompositeEntityExtractor.compute', sentence);
    let entities = [];
    for (const extractor of this.extractors) {
      // TODO: in parallel
      const extractorEntities = await extractor.compute(sentence);
      entities = entities.concat(extractorEntities);
    }
    return entities;
  }
}

module.exports = CompositeEntityExtractor;
