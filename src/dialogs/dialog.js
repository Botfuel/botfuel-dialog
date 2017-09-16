const Fs = require('fs');
const _ = require('underscore');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

/**
 * Dialog main class.
 */
class Dialog {
  /**
   * Constructor.
   * @param {Object} parameters the dialog parameters
   */
  constructor(config, brain, responses, parameters) {
    console.log('Dialog.constructor', parameters);
    this.config = config;
    this.brain = brain;
    this.responses = responses;
    this.parameters = parameters;
  }

    /**
   * Pushes a dialog on the stack.
   * @param {string} userId the user id
   * @param {string} label the dialog label
   * @param {Object} parameters the dialog parameters
   */
  async next(userId, label, parameters) {
    console.log('Dialog.next', userId, label, parameters);
    await this.brain.userPush(userId, 'dialogs', { label, parameters });
  }

  /**
   * Says something.
   * @param {string} userId the user id
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   */
  text(userId, label, parameters) {
    console.log('Dialog.say', userId, label, parameters);
    const templatePath = `${this.config.path}/src/views/templates/`;
    const templateName = `${templatePath}/${label}.${this.config.locale}.txt`;
    console.log('Dialog.say: templateName', templateName);
    Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .forEach((line) => {
        const payload = _.template(line)(parameters);
        if (payload !== '') {
          const response = {
            type: 'text',
            userId,
            botId: this.config.id,
            origin: 'bot',
            payload,
          };
          console.log('Dialog.say: response', response);
          this.responses.push(response);
        }
      });
  }
}

module.exports = Dialog;
