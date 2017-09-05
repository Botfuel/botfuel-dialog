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
  constructor(context, config) {
    console.log('DialogManager.constructor');
    this.context = context;
    this.config = config;
  }

  logContext(id) {
    console.log('DialogManager.logContext', this.context.data.users[id]);
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
        if (value > 0.7) { // TODO: fix this
          this.next(id, label);
        }
      });
    const dialogs = User.get(id, this.context, '_dialogs');
    console.log('DialogManager.execute: _dialogs', dialogs);
    if (dialogs.length === 0) {
      if (User.defined(id, this.context, '_lastDialog')) {
        const lastDialog = User.get(id, this.context, '_lastDialog');
        User.push(id, this.context, '_dialogs', lastDialog);
      }
    }
    User.set(id, this.context, '_responses', []);
    return this.executeDialogs(id, entities);
  }

  /**
   * Executes the dialogs.
   * @param {string} id the user id
   */
  executeDialogs(id, entities) {
    console.log('DialogManager.executeDialogs', id);
    this.logContext(id);
    const dialogs = User.get(id, this.context, '_dialogs');
    console.log('DialogManager.executeDialogs', dialogs);
    if (dialogs.length > 0) {
      const dialogData = dialogs.pop();
      User.set(id, this.context, '_lastDialog', dialogData);
      console.log('DialogManager.executeDialogs', dialogData);
      const Dialog = require(`${this.config.path}/src/controllers/dialogs/${dialogData.label}`);
      new Dialog(dialogData.parameters)
        .execute(this, id, entities)
        .then((run) => {
          if (run) { // continue executing the stack
            this.executeDialogs(id, entities);
          }
        });
    }
    const responses = User.get(id, this.context, '_responses');
    return Promise.resolve(responses);
  }

  /**
   * Pushes a dialog on the stack.
   * @param {string} id the user id
   * @param {string} label the dialog label
   * @param {Object} parameters the dialog parameters
   */
  next(id, label, parameters) {
    console.log('DialogManager.next', id, label, parameters);
    User.push(id, this.context, '_dialogs', { label, parameters });
  }

  /**
   * Says something.
   * @param {string} id the user id
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   */
  say(id, label, parameters, path) {
    console.log('DialogManager.say', label, parameters, path);
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
          User.push(id, this.context, '_responses', response);
        }
      });
  }
}

module.exports = DialogManager;
