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
      console.log('Dialog.textMessage: line', line);
      const text = _.template(line)(parameters);
      if (text !== '') {
        const message = Messages.botText(this.config.id, userId, text);
        this.pushMessage(responses, message);
      }
    }
  }

  /**
   * @param {string} userId the user id
   * @param {Object[]} responses
   * @param {Object[]} actions
   * @param {Object} options
   */
  actionsMessage(userId, responses, actions, options = {}) {
    console.log('Dialog.actionsMessage', userId, actions, options);
    const message = Messages.botActions(this.config.id, userId, actions, options);
    this.pushMessage(responses, message);
  }

  /**
   * @param {string} userId the user id
   * @param {Object[]} responses
   * @param {Object[]} quickreplies
   * @param {Object} options
   */
  quickrepliesMessage(userId, responses, quickreplies, options = {}) {
    console.log('Dialog.quickrepliesMessage', userId, quickreplies, options);
    const message = Messages.botQuickreplies(this.config.id, userId, quickreplies, options);
    this.pushMessage(responses, message);
  }

  /**
   * Add cards message to responses
   * @param {string} userId the user id
   * @param {Object[]} responses
   * @param {Object[]} cards
   * @param {Object} options
   */
  cardsMessage(userId, responses, cards, options = {}) {
    console.log('Dialog.cardsMessage', userId, cards, options);
    const message = Messages.botCards(this.config.id, userId, cards, options);
    this.pushMessage(responses, message);
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
