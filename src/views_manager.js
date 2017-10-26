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
      if (fs.existsSync(path)) {
        console.log('ViewsManager.getPath: existing path', path);
        return path;
      }
    }
    return null;
  }

  /**
   * resolve the view
   * @param {string} userId the user id
   * @param {string} name the view name
   * @param {string/null} key the view key
   * @param {object} parameters the template parameters
   */
  resolve(userId, name, key, parameters) {
    console.log('ViewsManager.resolve', userId, name, key, parameters);
    const path = this.getPath(name);
    if (path) {
      const View = require(path);
      const view = new View();
      let botMessages = view.render(this.botId, userId, key, parameters);
      if (!_.isArray(botMessages)) {
        botMessages = [botMessages];
      }
      return botMessages.map(botMessage => botMessage.toJson());
    }
    return null;
  }
}

module.exports = ViewsManager;
