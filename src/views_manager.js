const fs = require('fs');
const _ = require('lodash');
const BotTextMessage = require('./views/parts/bot_text_message');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

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
      console.log('ViewsManager.getPath: for loop path: ', path);
      if (fs.existsSync(path)) {
        console.log('ViewsManager.getTemplatePath: path exists', path);
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
    console.log('ViewsManager.render: path', path);
    if (path) {
      const fileExtension = this.getPath(template).split('.').pop();
      switch (fileExtension) {
        case 'js':
          return this.renderJsView(userId, path, template, parameters);
        case 'txt':
          return this.renderFromTextTemplate(userId, path, parameters);
        default:
          return null;
      }
    }
    return null;
  }

  renderFromTextTemplate(userId, templatePath, parameters) {
    console.log('ViewsManager.compileFromText');
    return fs
      .readFileSync(templatePath, 'utf8')
      .toString()
      .split('\n')
      .map(line => _.template(line)(parameters))
      .filter(Boolean)
      .map(text => new BotTextMessage(this.botId, userId, text).toJson());
  }

  renderJsView(userId, viewPath, keysPath, parameters) {
    const { dialogName, keysName } = this.explodeKeysPath(keysPath);
    console.log('ViewsManager.renderJsView', dialogName, keysName);
    const Dialog = require(viewPath);
    const dialog = new Dialog();
    let text = null;
    for (const key of keysName) {
      text = dialog.render(key, parameters);
      if (text !== null && text.length > 0) {
        break;
      }
    }
    console.log('ViewsManager.renderJsView: text', text);
    return [new BotTextMessage(this.botId, userId, text).toJson()];
  }

  explodeKeysPath(keysPath) {
    const keys = keysPath.split('_');
    console.log('ViewsManager.explodeKeysPath', keys);
    const dialogName = keys[0];
    const keysName = [];
    if (keys[1] === 'entities' && ['ask', 'confirm', 'discard'].indexOf(keys[2]) !== -1) {
      keysName.push(_.camelCase(`${keys[1]} ${keys[2]}`));
    } else if (['entities', 'ask', 'confirm', 'discard'].indexOf(keys[1]) === -1) {
      keysName.push(_.camelCase(`${keys[1]} ${keys[2]}`));
      keysName.push(_.camelCase(`entity ${keys[2]}`));
    } else {
      keysName.push(keys[1]);
    }
    return { dialogName, keysName };
  }
}

module.exports = ViewsManager;
