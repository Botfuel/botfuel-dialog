const fs = require('fs');
const _ = require('lodash');
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
   * @param {string} key the view key
   * @param {Object} parameters the template parameters
   */
  resolve(userId, name, key, parameters) {
    console.log('ViewsManager.render', userId, name, key, parameters);
    const path = this.getPath(name);
    if (path) {
      const View = require(path);
      const view = new View();
      console.log(
        'ViewsManager.render: view, instance Text, instance Prompt',
        view,
        view instanceof TextView,
        view instanceof PromptView,
      );
      if (view instanceof TextView) {
        return view.render(this.botId, userId, parameters);
      } else if (view instanceof PromptView) {
        return view.render(this.botId, userId, key, parameters);
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
