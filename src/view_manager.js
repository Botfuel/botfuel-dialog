const fs = require('fs');
const logger = require('logtown')('ViewManager');
const { ViewError } = require('./errors');

/**
 * The view manager resolves the view for a given dialog.
 */
class ViewManager {
  /**
   * @constructor
   * @param {Object} config - the bot config
   */
  constructor(config) {
    logger.debug('constructor', config.path);
    this.viewsPath = `${config.path}/src/views`;
    this.locale = config.locale;
  }

  /**
   * Gets the path for a given name.
   * @param {String} name - the dialog name
   * @returns {String|null} the path if exists or null
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
   * Resolves the view for a given dialog name.
   * @param {String} name - the dialog name
   * @returns {View|null} the view instance or null
   */
  resolve(name) {
    logger.debug('resolve', name);
    const path = this.getPath(name);
    if (path) {
      const View = require(path);
      return new View();
    }

    throw new ViewError({
      view: {
        name,
      },
    });
  }
}

module.exports = ViewManager;
