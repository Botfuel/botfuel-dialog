const Fs = require('fs');
const _ = require('underscore');
const Messages = require('../messages');

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
    console.log('Dialog.textMessage', userId, label, parameters);
    const templateName = `${this.templatePath}/${label}.${this.config.locale}.txt`;
    console.log('Dialog.textMessage: templateName', templateName);
    Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .forEach((line) => {
        const text = _.template(line)(parameters);
        if (text !== '') {
          this.pushMessage(responses, Messages.botText(this.config.id, userId, text));
        }
      });
  }

  pushMessage(responses, message) {
    console.log('Dialog.pushMessage', responses, message);
    responses.push(message);
  }
}

module.exports = Dialog;
