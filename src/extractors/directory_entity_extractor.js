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
    super(dir
          .files(path, { sync: true })
          .filter(file => file.match(/^.*.js$/))
          .map(file => new (require(file))()));
  }
}

module.exports = DirectoryEntityExtractor;
