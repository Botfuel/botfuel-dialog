const Fs = require('fs');
const _ = require('underscore');
const BotTextMessage = require('../views/parts/bot_text_message');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

/**
 * Generates messages.
 */
class Dialog {
  /**
   * Constructor.
   * @param {Object} parameters the dialog parameters
   */
  constructor(config, brain, parameters) {
    // console.log('Dialog.constructor', parameters);
    this.maxComplexity = Number.MAX_SAFE_INTEGER;
    this.config = config;
    this.brain = brain;
    this.parameters = parameters;
    this.templatePath = `${this.config.path}/src/views/templates`;
  }

  /**
   * @param {string} userId the user id
   * @param {Object[]} responses
   * @param {string} template the template
   * @param {Object} parameters the template parameters
   */
  textMessages(userId, template, parameters) {
    console.log('Dialog.textMessage', userId, template, parameters);
    // TODO: resolve the template given the label (allowing fallback)
    const templateName = `${this.templatePath}/${template}.${this.config.locale}.txt`;
    return Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .map(line => _.template(line)(parameters))
      .filter(text => text !== '')
      .map(text => new BotTextMessage(this.config.id, userId, text).toJson());
  }

  pushMessages(responses, messages) {
    for (const message of messages) {
      responses.push(message);
    }
  }

  pushMessage(responses, message) {
    responses.push(message);
  }
}

module.exports = Dialog;
