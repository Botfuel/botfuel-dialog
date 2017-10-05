const fs = require('fs');
const dir = require('node-dir');
const CompositeEntityExtractor = require('./composite_entity_extractor');

/**
 * Class for extracting entities.
 */
class DirectoryEntityExtractor extends CompositeEntityExtractor {
  /**
   * Constructor.
   * @param {Object} path - the bot's config
   */
  constructor(path) {
    console.log('DirectoryEntityExtractor.constructor', path);
    let files = [];
    if (fs.existsSync(path)) {
      files = dir.files(path, { sync: true }) || files;
    }
    super(files
          .filter(file => file.match(/^.*.js$/))
          .map(file => new (require(file))()));
  }
}

module.exports = DirectoryEntityExtractor;
