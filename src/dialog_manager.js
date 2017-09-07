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
        if (value > this.config.intentThreshold) {
          this.next(id, label);
        }
      });
    this.context.get(id, 'dialogs').then((dialogs) => {
      console.log('DialogManager.execute: _dialogs', dialogs);
      if (dialogs.length === 0) {
        this.context.get(id, 'lastDialog').then((lastDialog) => {
          if (_.size(lastDialog) > 0) {
            this.context.push(id, 'dialogs', lastDialog);
          }
        });
      }
      return this.executeDialogs(id, entities, []);
    });
    /*
    BEFORE
    const dialogs = User.get(id, this.context, '_dialogs');
    console.log('DialogManager.execute: _dialogs', dialogs);
    if (dialogs.length === 0) {
      if (User.defined(id, this.context, '_lastDialog')) {
        const lastDialog = User.get(id, this.context, '_lastDialog');
        User.push(id, this.context, '_dialogs', lastDialog);
      }
    }
    return this.executeDialogs(id, entities, []);
    */
  }

  /**
   * Executes the dialogs.
   * @param {string} id the user id
   * @param {Object[]} entities - the entities
   * @param {Object[]} responses - responses array
   */
  executeDialogs(id, entities, responses) {
    console.log('DialogManager.executeDialogs', id, responses);
    this.context.get(id, 'dialogs').then((dialogs) => {
      console.log('DialogManager.executeDialogs', dialogs);
      if (dialogs.length > 0) {
        const dialogData = dialogs.pop();
        this.context.set(id, 'lastDialog', dialogData);
        console.log('DialogManager.executeDialogs', dialogData);
        const Dialog = require(`${this.config.path}/src/controllers/dialogs/${dialogData.label}`);
        new Dialog(dialogData.parameters)
          .execute(this, id, entities, responses)
          .then(({ run, dialogResponses }) => {
            if (run) { // continue executing the stack
              this.executeDialogs(id, entities, dialogResponses);
            }
          });
      }
      return Promise.resolve(responses);
    });
    /*
    BEFORE
    const dialogs = User.get(id, this.context, '_dialogs');
    console.log('DialogManager.executeDialogs', dialogs);
    if (dialogs.length > 0) {
      const dialogData = dialogs.pop();
      User.set(id, this.context, '_lastDialog', dialogData);
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
    return Promise.resolve(responses);
    */
  }

  /**
   * Pushes a dialog on the stack.
   * @param {string} id the user id
   * @param {string} label the dialog label
   * @param {Object} parameters the dialog parameters
   */
  next(id, label, parameters) {
    console.log('DialogManager.next', id, label, parameters);
    this.context.push(id, 'dialogs', { label, parameters })
      .then((dialogs) => {
        console.log('DialogManager.next dialogs', dialogs);
        // what should we do here ?
        return true;
      });
  }

  /**
   * Says something.
   * @param {string} id the user id
   * @param {string} label the template label
   * @param {Object} parameters the template parameters
   * @param {Object[]} responses - responses array
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
