const Fs = require('fs');
const _ = require('underscore');
const BotTextMessage = require('./views/parts/bot_text_message');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

class TemplateManager {
  constructor(config, namespace) {
    this.templatePath = `${config.path}/src/views/templates`;
    this.botId = config.id;
    this.locale = config.locale;
    this.namespace = namespace;
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
    const templateName = `${this.templatePath}/${template}.${this.locale}.txt`;
    return Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .map(line => _.template(line)(parameters))
      .filter(Boolean)
      .map(text => new BotTextMessage(this.botId, userId, text).toJson());
  }

  entityAsk(id, entity) {
    console.log('TemplateManager.entityAsk', id, entity);
    return this.compile(id, `${this.namespace}_${entity}_ask`, { entity });
  }

  entityConfirm(id, entity) {
    console.log('TemplateManager.entityConfirm', id, entity);
    return this.compile(id, `${this.namespace}_${entity.dim}_confirm`, { entity });
  }

  dialogConfirm(id) {
    console.log('TemplateManager.dialogConfirm', id);
    return this.compile(id, `${this.namespace}_confirm`, null);
  }
}

module.exports = TemplateManager;
