const fs = require('fs');
const _ = require('lodash');

class ViewsManager {
  constructor(config) {
    console.log('ViewsManager.constructor', config.path);
    this.viewsPath = `${config.path}/src/views`;
    this.botId = config.id;
    this.locale = config.locale;
  }

  getPath(name) {
    console.log('ViewsManager.getPath');
    const paths = [
      `${this.viewsPath}/${name}_view.${this.locale}.js`,
      `${this.viewsPath}/${name}_view.js`,
      `${__dirname}/views/${name}_view.${this.locale}.js`,
      `${__dirname}/views/${name}_view.js`,
    ];
    for (const path of paths) {
      console.log('ViewsManager.getPath: test path', path);
      if (fs.existsSync(path)) {
        console.log('ViewsManager.getPath: existing path', path);
        return path;
      }
    }
    return null;
  }

  /**
   * resolve the view
   * @param {string} name the view name
   */
  resolve(name) {
    console.log('ViewsManager.resolve', name);
    const path = this.getPath(name);
    if (path) {
      const View = require(path);
      return new View();
    }
    return null;
  }
}

module.exports = ViewsManager;
