const fs = require('fs');
const logger = require('logtown')('ViewsManager');

/**
 * ViewsManager
 * @class
 * @classdesc resolve a dialog view
 * @param {object} config - the bot's config
 */
class ViewsManager {
  constructor(config) {
    logger.debug('constructor', config.path);
    this.viewsPath = `${config.path}/src/views`;
    this.botId = config.id;
    this.locale = config.locale;
  }

  /**
   * Get dialog path for a given name
   * @param {string} name - the dialog name
   * @returns {string|null} the dialog path if exists or null
   */
  getPath(name) {
    logger.debug('getPath');
    const paths = [
      `${this.viewsPath}/${name}_view.${this.locale}.js`,
      `${this.viewsPath}/${name}_view.js`,
      `${__dirname}/views/${name}_view.${this.locale}.js`,
      `${__dirname}/views/${name}_view.js`,
    ];
    for (const path of paths) {
      logger.debug('getPath: test path', path);
      if (fs.existsSync(path)) {
        logger.debug('getPath: existing path', path);
        return path;
      }
    }
    return null;
  }

  /**
   * Resolve a view for a given dialog name
   * @param {string} name - the view name
   * @returns {class|null} the dialog instance or null
   */
  resolve(name) {
    logger.debug('resolve', name);
    const path = this.getPath(name);
    if (path) {
      const View = require(path);
      return new View();
    }
    return null;
  }
}

module.exports = ViewsManager;
