const Fs = require('fs');
const _ = require('underscore');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

/**
 * Default DialogManager.
 */
class DialogManager {
  /**
   * Constructor.
   */
  constructor(brain, config) {
    console.log('DialogManager.constructor');
    this.brain = brain;
    this.config = config;
    this.intentThreshold = this.config.intentThreshold || 0.8;
  }

  acceptIntent(value) {
    return (value > this.intentThreshold);
  }

  /**
   * Populates and executes the stack.
   * @param {string} id the user id
   * @param {string[]} intents the intents
   * @param {Object[]} entities the transient entities
   */
  execute(id, intents, entities) {
    console.log('DialogManager.execute', id, intents, entities);
    intents
      .forEach(({ label, value }) => {
        if (this.acceptIntent(value)) {
          this.next(id, label);
        }
      });
    this
      .brain
      .get(id, 'dialogs')
      .then((dialogs) => {
        console.log('DialogManager.execute: _dialogs', dialogs);
        if (dialogs.length === 0) {
          this
            .brain
            .get(id, 'lastDialog')
            .then((lastDialog) => {
              this.brain.push(id, 'dialogs', lastDialog);
            });
        }
        return this.executeDialogs(id, entities, []);
      });
  }

  /**
   * Executes the dialogs.
   * @param {string} id the user id
   * @param {Object[]} entities - the entities
   * @param {string[]} responses - responses array
   */
  executeDialogs(id, entities, responses) {
    console.log('DialogManager.executeDialogs', id, entities, responses);
    this
      .brain
      .get(id, 'dialogs')
      .then((dialogs) => {
        console.log('DialogManager.executeDialogs', dialogs);
        if (dialogs.length > 0) {
          const dialogData = dialogs.pop();
          this
            .brain
            .set(id, 'lastDialog', dialogData);
          console.log('DialogManager.executeDialogs', dialogData);
          const Dialog = require(`${this.config.path}/src/controllers/dialogs/${dialogData.label}`);
          new Dialog(dialogData.parameters)
            .execute(this, id, entities, responses)
            .then(({ run, responses }) => {
              if (run) { // continue executing the stack
                this.executeDialogs(id, entities, responses);
              }
            });
        }
      });
  }

  /**
   * Pushes a dialog on the stack.
   * @param {string} id the user id
   * @param {string} label the dialog label
   * @param {Object} parameters the dialog parameters
   */
  next(id, label, parameters) {
    console.log('DialogManager.next', id, label, parameters);
    this.brain.push(id, 'dialogs', { label, parameters });
  }

  /**
   * Says something.
   * @param {string} id the user id
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   * @param {string[]} responses - responses array
   * @param {string} path
   */
  say(id, label, parameters, responses, path) {
    console.log('DialogManager.say', label, parameters, responses, path);
    const templatePath = path || `${this.config.path}/src/views/templates/`;
    const templateName = `${templatePath}/${label}.${this.config.locale}.txt`;
    console.log('DialogManager.say', templateName);
    Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .forEach((line) => {
        console.log('DialogManager.say', line);
        const payload = _.template(line)(parameters);
        console.log('DialogManager.say', payload);
        if (payload !== '') {
          const response = {
            type: 'text',
            payload,
          };
          console.log('DialogManager.say', response);
          responses.push(response);
        }
      });
  }
}

module.exports = DialogManager;
