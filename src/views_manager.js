const fs = require('fs');
const _ = require('lodash');
const TextView = require('./views/text_view');

class ViewsManager {
  constructor(config) {
    console.log('ViewsManager.constructor', config.path);
    this.viewsPath = `${config.path}/src/views`;
    this.templatePath = `${this.viewsPath}/templates`;
    this.botId = config.id;
    this.locale = config.locale;
  }

  getPath(template) {
    console.log('ViewsManager.getPath');
    const dialogName = template.split('_').shift();
    const paths = [
      `${this.viewsPath}/${dialogName}_view.${this.locale}.js`,
      `${this.templatePath}/${template}.${this.locale}.txt`,
      `${__dirname}/views/${dialogName}_view.${this.locale}.js`,
      `${__dirname}/views/templates/${template}.${this.locale}.txt`,
    ];
    for (const path of paths) {
      if (fs.existsSync(path)) {
        return path;
      }
    }
    return null;
  }

  /**
   * Compile the template
   * @param {string} userId the user id
   * @param {string} template the template
   * @param {Object} parameters the template parameters
   */
  resolve(userId, template, parameters) {
    console.log('ViewsManager.render', userId, template, parameters);
    const path = this.getPath(template);
    if (path) {
      const fileExtension = _.cloneDeep(path).split('.').pop();
      switch (fileExtension) {
        case 'txt':
          return this.renderTextView(userId, path, parameters);
        case 'js':
          return this.renderPromptView(userId, path, template, parameters);
        default:
          return null;
      }
    }
    return null;
  }

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
}

module.exports = ViewsManager;
