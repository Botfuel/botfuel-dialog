const fs = require('fs');

/**
 * Turns NLU output into a dialog stack.
 */
class DialogManager {
  /**
   * Constructor.
   */
  constructor(brain, config) {
    // console.log('DialogManager.constructor');
    this.brain = brain;
    this.config = config;
    this.intentThreshold = this.config.intentThreshold || 0.8;
    this.generation = -1;
  }

  getDialogPath(label) {
    console.log('DialogManager.getDialogPath', label);
    const paths = [
      `${this.config.path}/src/controllers/dialogs/${label}.${this.config.adapter}`,
      `${this.config.path}/src/controllers/dialogs/${label}`,
      `${__dirname}/dialogs/${label}.${this.config.adapter}`,
      `${__dirname}/dialogs/${label}`,
    ];
    for (const path of paths) {
      console.log('DialogManager.getDialogPath: path', path);
      if (fs.existsSync(`${path}.js`)) {
        return path;
      }
    }
    return null;
  }

  getDialog(dialog) {
    console.log('DialogManager.getDialog', dialog);
    const path = this.getDialogPath(dialog.label);
    if (path === null) {
      return null;
    }
    const DialogConstructor = require(path);
    return new DialogConstructor(this.config, this.brain);
  }

   /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} dialogs - the dialogs
   * @param {string} lastDialog - the last dialog
   * @param {Object[]} intents - the intents
   * @param {Object[]} entities - the entities
   */
  updateDialogs(userId, dialogs, lastDialog, intents, entities) {
    console.log('DialogManager.updateDialogs', userId, dialogs, lastDialog, intents, entities);
    intents = intents
      .filter(intent => intent.value > this.intentThreshold)
      .sort((intent1, intent2) => {
        const dialog1 = this.getDialog(intent1);
        const dialog2 = this.getDialog(intent2);
        if (dialog1.maxComplexity !== dialog2.maxComplexity) {
          return dialog2.maxComplexity - dialog1.maxComplexity;
        }
        return intent1.value - intent2.value;
      });
    console.log('DialogManager.updateDialogs: intents', intents);
    for (const intent of intents) {
      const label = intent.label;
      if (dialogs.length === 0 || dialogs[dialogs.length - 1].label !== label) {
        dialogs.push({ label, entities, generation: this.generation });
      }
    }
    if (dialogs.length === 0) {
      if (lastDialog !== undefined) {
        dialogs.push(lastDialog);
      } else {
        // no intent detected
        dialogs.push({ label: 'default_dialog' });
      }
    }
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} dialogs - the dialogs
   * @param {Object[]} entities - the entities
   */
  async executeDialogs(userId, dialogs, entities) {
    console.log('DialogManager.executeDialogs', userId, dialogs, entities);
    const responses = [];
    const user = await this.brain.getUser(userId);
    console.log('DialogManager.executeDialogs', user);
    let done = true;
    while (done && dialogs.length > 0) {
      const dialog = dialogs[dialogs.length - 1];
      console.log('DialogManager.executeDialogs: dialog', dialog);
      // eslint-disable-next-line no-await-in-loop
      await this.brain.userSet(userId, 'lastDialog', dialog);
      // has the dialog justed been stacked?
      const dialogAge = this.generation - dialog.generation;
      // eslint-disable-next-line no-await-in-loop
      done = await this
        .getDialog(dialog)
        .execute(userId, responses, entities, dialogAge);
      console.log('DialogManager.executeDialogs: done', done);
      if (done) {
        dialogs = dialogs.slice(0, -1);
      }
    }
    await this.brain.userSet(userId, 'dialogs', dialogs);
    return responses;
  }

  /**
   * Populates and executes the stack.
   * @param {string} userId the user id
   * @param {string[]} intents the intents
   * @param {Object[]} entities the transient entities
   */
  async execute(userId, intents, entities) {
    console.log('DialogManager.execute', userId, intents, entities);
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    const lastDialog = await this.brain.userGet(userId, 'lastDialog');
    this.generation++;
    this.updateDialogs(userId, dialogs, lastDialog, intents, entities);
    return this.executeDialogs(userId, dialogs, entities);
  }
}

module.exports = DialogManager;
