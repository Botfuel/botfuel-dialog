const dir = require('node-dir');
const CompositeEntityExtractor = require('./composite_entity_extractor');

/**
 * Class for extracting entities.
 */
class DirectoryEntityExtractor extends CompositeEntityExtractor {
  /**
   * Constructor.
   * @param {Object} config the bot's config
   */
  constructor(path) {
    console.log('DirectoryEntityExtractor.constructor', path);
    const files = dir.files(path, { sync: true }) || [];
    super(files
          .filter(file => file.match(/^.*.js$/))
          .map(file => new (require(file))()));
  }
}

module.exports = DirectoryEntityExtractor;
