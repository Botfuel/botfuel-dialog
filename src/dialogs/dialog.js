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
   * @param {string} userId the user id
   * @param {Object[]} responses
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   */
  textMessage(userId, responses, label, parameters) {
    console.log('Dialog.textMessage', userId, label, parameters);
    const templateName = `${this.templatePath}/${label}.${this.config.locale}.txt`;
    console.log('Dialog.textMessage: templateName', templateName);
    const lines = Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n');
    for (const line of lines) {
      const text = _.template(line)(parameters);
      if (text !== '') {
        this.pushMessage(responses, Messages.botText(this.config.id, userId, text));
      }
    }
  }

  /**
   * @param {string} userId the user id
   * @param {Object[]} responses
   * @param {Object[]} actions
   * @param {Object} options
   */
  actionsMessage(userId, responses, actions, options) {
    console.log('Dialog.actionsMessage', userId, actions, options);
    this.pushMessage(responses, Messages.botActions(this.config.id, userId, actions, options));
  }

  /**
   * @param {string} userId the user id
   * @param {Object[]} responses
   * @param {Object[]} actions
   * @param {Object} options
   */
  quickrepliesMessage(userId, responses, texts, options) {
    console.log('Dialog.quickrepliesMessage', userId, texts, options);
    this.pushMessage(responses, Messages.botQuickreplies(this.config.id, userId, texts, options));
  }

  /**
   * Push message to responses
   * @param {Object[]} responses
   * @param {Object} message
   */
  pushMessage(responses, message) {
    console.log('Dialog.pushMessage', responses, message);
    responses.push(message);
  }
}

module.exports = Dialog;
