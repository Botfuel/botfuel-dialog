const Fs = require('fs');
const User = require('@botfuel/bot-common').User;
const _ = require('underscore');

_.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };

class DialogManager {
  /**
   * Constructor.
   */
  constructor(context, config, path) {
    console.log('DialogManager.constructor', '<context>', config, path);
    this.context = context;
    this.config = config;
    this.path = path;
  }

  logContext(id) {
    console.log('DialogManager.logContext', this.context.data.users[id]);
  }

  /**
   * Populates and executes the stack.
   * @param {Object[]} entities the transient entities
   * @param {string[]} intents the intents
   */
  execute(id, intents, entities) {
    console.log('DialogManager.execute', id, intents, entities);
    User.set(id, this.context, '_entities', entities);
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
    return this.executeDialogs(id);
  }

  /**
   * Executes the dialogs.
   */
  executeDialogs(id) {
    console.log('DialogManager.executeDialogs', id);
    this.logContext(id);
    const dialogs = User.get(id, this.context, '_dialogs');
    console.log('DialogManager.executeDialogs', dialogs);
    if (dialogs.length > 0) {
      const dialogData = dialogs.pop();
      User.set(id, this.context, '_lastDialog', dialogData);
      console.log('DialogManager.executeDialogs', dialogData);
      const Dialog = require(`${this.path}/scripts/src/controllers/dialogs/${dialogData.label}`);
      new Dialog(dialogData.parameters)
        .execute(this, id)
        .then((run) => {
          if (run) {
            this.executeDialogs(id);
          }
        });
    }
    const responses = User.get(id, this.context, '_responses');
    return Promise.resolve(responses);
  }


  next(id, label, parameters) {
    console.log('DialogManager.next', id, label, parameters);
    User.push(id, this.context, '_dialogs', { label, parameters });
  }

  say(id, label, parameters) {
    console.log('DialogManager.say', label, parameters);
    const templateName = `${this.path}/scripts/src/views/templates/${label}.${this.config.locale}.txt`;
    console.log('DialogManager.say', templateName);
    Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .forEach((line) => {
        console.log('DialogManager.say', line);
        const payload = _.template(line)(parameters);
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
