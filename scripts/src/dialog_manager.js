'use strict';

/**
 * Manages the dialog/step stack.
 */
class DialogManager {
  /**
   * Constructor.
   */
  constructor(context) {
    this.dialogs = [];
    this.context = context;
  }

  /**
   * Populates and executes the stack.
   * @param {Object[]} entities the transient entities
   * @param {string[]} intents the intents
   */
  executeIntents(intents, entities) {
    console.log("DialogManager.executeIntents");
    this.updateDialogs(intents);
    this.responses = [];
    this.entities = entities;
    return this.executeDialogs();
  }

  /**
   * Updates the stack with the steps.
   * @param {Object[]} intents an array of intents with their probabilities
   */
  updateDialogs(intents) {
    console.log("DialogManager.updateDialogs");
    intents
      .forEach(({label, value}) => {
        if (value > 0.7) { // TODO: fix this
          this.call(label);
        }
      });
  }

  call(label, parameters) {
    let Dialog = require(`./dialogs/${ label }`);
    this
      .dialogs
      .push(new Dialog(parameters));
  }

  respond(response) {
    this
      .responses
      .push(response);
  }

  /**
   * Executes the dialogs.
   */
  executeDialogs() {
    console.log("DialogManager.executeDialogs", this.dialogs);
    if (this.dialogs.length > 0) {
      this
        .dialogs
        .pop()
        .execute(this)
        .then((cont) => {
          if (cont) {
            executeDialogs()
          }
        });
    }
    return Promise.resolve(this.responses);
  }
}

module.exports = DialogManager;
