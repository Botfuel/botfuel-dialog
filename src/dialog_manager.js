'use strict';

const Fs = require('fs');
const User = require('@botfuel/bot-common').User;
const _ = require('underscore')
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
      .forEach(({label, value}) => {
        if (value > 0.7) { // TODO: fix this
          this.next(id, label);
        }
      });
    let dialogs = User.get(id, this.context, '_dialogs');
    console.log('DialogManager.execute: _dialogs', dialogs);
    if (dialogs.length == 0) {
      if (User.defined(id, this.context, '_lastDialog')) {
        let lastDialog = User.get(id, this.context, '_lastDialog');
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
    let dialogs = User.get(id, this.context, '_dialogs');
    console.log('DialogManager.executeDialogs', dialogs);
    if (dialogs.length > 0) {
      let dialogData = dialogs.pop();
      User.set(id, this.context, '_lastDialog', dialogData);
      console.log('DialogManager.executeDialogs', dialogData);
      let Dialog = require(`${ this.path}/scripts/src/controllers/dialogs/${ dialogData.label }`);
      let dialog = new Dialog(this, dialogData.parameters);
      dialog
        .execute(this, id)
        .then((run) => {
          if (run) {
            this.executeDialogs(id)
          }
        });
    }
    let responses = User.get(id, this.context, '_responses');
    return Promise.resolve(responses)
  }


  next(id, label, parameters) {
    console.log('DialogManager.next', id, label, parameters);
    let dialogData = {
      label: label,
      parameters: parameters
    };
    User.push(id, this.context, '_dialogs', dialogData);
  }

  say(id, label, parameters) {
    console.log('DialogManager.say', label, parameters);
    let templateName = `${ this.path }/scripts/src/views/templates/${ label }.${ this.config.locale }.txt`;
    console.log('DialogManager.say', templateName);
    Fs
      .readFileSync(templateName, 'utf8')
      .toString()
      .split('\n')
      .map((line) => {
        console.log('DialogManager.say', line);
        let response = _.template(line)(parameters);
        if (response != '') {
          console.log('DialogManager.say', response);
          User.push(id, this.context, '_responses', response);
        }
      });
  }
}

module.exports = DialogManager;
