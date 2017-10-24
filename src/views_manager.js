const fs = require('fs');
const TextView = require('./views/text_view');
const PromptView = require('./views/prompt_view');

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
   * Compile the template
   * @param {string} userId the user id
   * @param {string} name the view name
   * @param {string[]/null} keys the view keys list
   * @param {object} parameters the template parameters
   */
  resolve(userId, name, keys, parameters) {
    console.log('ViewsManager.resolve', userId, name, keys, parameters);
    const path = this.getPath(name);
    if (path) {
      const View = require(path);
      const view = new View();
      if (view instanceof TextView) {
        console.log('ViewsManager.resolve: render TextView', view);
        return view.render(this.botId, userId, parameters);
      } else if (view instanceof PromptView) {
        console.log('ViewsManager.resolve: render PromptView', view);
        return view.render(this.botId, userId, keys, parameters);
      }
    }
    return null;
  }

  /*
  renderTextView(userId, templatePath, parameters) {
    return TextView.render(this.botId, userId, templatePath, parameters);
  }

  renderPromptView(userId, viewPath, keysPath, parameters) {
    const keys = this.getViewKeys(keysPath);
    console.log('ViewsManager.renderPromptView', keys);
    const View = require(viewPath);
    const view = new View();
    let botMessages;
    for (const key of keys) {
      botMessages = view.render(this.botId, userId, _.camelCase(key), parameters);
      if (botMessages.length > 0) {
        break;
      }
    }
    return botMessages;
  }

  getViewKeys(keysPath) {
    const keysList = keysPath.split('_');
    console.log('ViewsManager.getViewKeys', keysList);
    const keys = [];
    if (keysList[1] === 'entities' && ['ask', 'confirm', 'discard'].indexOf(keysList[2]) !== -1) {
      keys.push(`${keysList[1]} ${keysList[2]}`);
    } else if (['entities', 'ask', 'confirm', 'discard'].indexOf(keysList[1]) === -1) {
      keys.push(`${keysList[1]} ${keysList[2]}`);
      keys.push(`entity ${keysList[2]}`);
    } else {
      keys.push(keysList[1]);
    }
    return keys;
  }
  */
}

module.exports = ViewsManager;
