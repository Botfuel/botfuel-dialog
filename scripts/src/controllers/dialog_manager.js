'use strict';

const User = require('@botfuel/bot-common').User;

class DialogManager {
  /**
   * Constructor.
   */
  constructor(context) {
    console.log("DialogManager.constructor");
    this.context = context;
  }

  logContext(id) {
    console.log("DialogManager.logContext", this.context.data.users[id]);
  }

  /**
   * Populates and executes the stack.
   * @param {Object[]} entities the transient entities
   * @param {string[]} intents the intents
   */
  execute(id, intents, entities) {
    console.log("DialogManager.execute", id, intents, entities);
    intents
      .forEach(({label, value}) => {
        if (value > 0.7) { // TODO: fix this
          this.next(id, label);
        }
      });
    User.set(id, this.context, '_entities', entities);
    let dialogs = User.get(id, this.context, '_dialogs');
    console.log("DialogManager.execute: dialogs", dialogs);


    // TODO: fix this ... does not work when lastIntent is not a prompt
    if (dialogs.length == 0) {
      if (User.defined(id, this.context, '_lastDialog')) {
        let lastDialog = User.get(id, this.context, '_lastDialog');
        User.push(id, this.context, '_dialogs', lastDialog);
      }
    }


    return this.executeDialogs(id, []);
  }

  next(id, label, parameters) {
    console.log("DialogManager.next", id, label, parameters);
    let dialogData = {
      label: label,
      parameters: parameters
    };
    User.push(id, this.context, '_dialogs', dialogData);
  }

  /**
   * Executes the dialogs.
   */
  executeDialogs(id, responses) {
    console.log("DialogManager.executeDialogs", id, responses);
    this.logContext(id);
    let dialogs = User.get(id, this.context, '_dialogs');
    console.log("DialogManager.executeDialogs", dialogs);
    if (dialogs.length > 0) {
      let dialogData = dialogs.pop();
      User.set(id, this.context, '_lastDialog', dialogData);
      console.log("DialogManager.executeDialogs", dialogData);
      let Dialog = require(`./dialogs/${ dialogData.label }`);
      let dialog = new Dialog(this, dialogData.parameters);
      dialog
        .execute(id, responses)
        .then((run) => {
          if (run) {
            this.executeDialogs(id, responses)
          }
        });
    }
    return Promise.resolve(responses);
  }
}

module.exports = DialogManager;
