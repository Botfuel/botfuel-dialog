const Fs = require('fs');
const Messages = require('../messages');
const _ = require('underscore');

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
    console.log('Dialog.constructor', parameters);
    this.config = config;
    this.brain = brain;
    this.parameters = parameters;
    this.templatePath = `${this.config.path}/src/views/templates`;
  }

  /**
   * Says something.
   * @param {string} userId the user id
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   */
  textMessage(userId, responses, label, parameters) {
    console.log('Dialog.say', userId, label, parameters);
    const templateName = `${this.templatePath}/${label}.${this.config.locale}.txt`;
    console.log('Dialog.say: templateName', templateName);
    Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .forEach((line) => {
        const payload = _.template(line)(parameters);
        if (payload !== '') {
          responses.push(Messages.getBotTextMessage(this.config.id, userId, payload));
        }
      });
  }
}

module.exports = Dialog;
