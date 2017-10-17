const fs = require('fs');
const _ = require('underscore');
const BotTextMessage = require('./views/parts/bot_text_message');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

class TemplateManager {
  constructor(config, namespace) {
    this.templatePath = `${config.path}/views/templates`;
    this.botId = config.id;
    this.locale = config.locale;
    this.namespace = namespace;
  }

  getTemplatePath(template) {
    console.log('TemplateManager.getTemplatePath');
    const paths = [
      `${this.templatePath}/${template}.${this.locale}.txt`,
      `${__dirname}/views/templates/${template}.${this.locale}.txt`,
    ];
    for (const path of paths) {
      console.log('TemplateManager.getTemplatePath: path exists ?', path, fs.existsSync(path));
      if (fs.existsSync(path)) {
        console.log('TemplateManager.getTemplatePath: path exists', path);
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
  compile(userId, template, parameters) {
    console.log('TemplateManager.compile', userId, template, parameters);
    // TODO: resolve the template given the label (allowing fallback)
    const templatePath = this.getTemplatePath(template);
    if (templatePath) {
      return fs
        .readFileSync(templatePath, 'utf8')
        .toString()
        .split('\n')
        .map(line => _.template(line)(parameters))
        .filter(Boolean)
        .map(text => new BotTextMessage(this.botId, userId, text).toJson());
    }
    return null;
  }

  entityAsk(id, entity) {
    console.log('TemplateManager.entityAsk', id, entity);
    return this.compile(id, `${this.namespace}_${entity}_ask`, { entity });
  }

  entityConfirm(id, entity) {
    console.log('TemplateManager.entityConfirm', id, entity);
    return this.compile(id, `${this.namespace}_${entity.dim}_confirm`, { entity });
  }

  dialogAsk(id) {
    console.log('TemplateManager.dialogAsk', id);
    return this.compile(id, `${this.namespace}_ask`, null);
  }

  dialogConfirm(id) {
    console.log('TemplateManager.dialogConfirm', id);
    return this.compile(id, `${this.namespace}_confirm`, null);
  }

  dialogDiscard(id) {
    console.log('TemplateManager.dialogDiscard', id);
    return this.compile(id, `${this.namespace}_discard`, null);
  }
}

module.exports = TemplateManager;
