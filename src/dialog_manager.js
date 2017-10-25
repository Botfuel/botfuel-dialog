const fs = require('fs');
const Dialog = require('./dialogs/dialog');

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
  }

  getDialogPath(label) {
    // console.log('DialogManager.getDialogPath', label);
    const paths = [
      `${this.config.path}/src/controllers/dialogs/${label}.${this.config.adapter}`,
      `${this.config.path}/src/controllers/dialogs/${label}`,
      `${__dirname}/dialogs/${label}.${this.config.adapter}`,
      `${__dirname}/dialogs/${label}`,
    ];
    for (const path of paths) {
      // console.log('DialogManager.getDialogPath: path', path);
      if (fs.existsSync(`${path}.js`)) {
        return path;
      }
    }
    return null;
  }

  getDialog(dialog) {
    // console.log('DialogManager.getDialog', dialog);
    const path = this.getDialogPath(dialog.label);
    if (path === null) {
      return null;
    }
    const DialogConstructor = require(path);
    return new DialogConstructor(this.config, this.brain, DialogConstructor.params);
  }

  filterIntents(intents) {
    console.log('DialogManager.filterIntents', intents);
    return intents
      .filter(intent => intent.value > this.intentThreshold)
      .slice(0, 2)
      .sort((intent1, intent2) => {
        const dialog1 = this.getDialog(intent1);
        const dialog2 = this.getDialog(intent2);
        return dialog2.maxComplexity - dialog1.maxComplexity;
      });
  }

  pushDialog(dialogs, label, entities, status = Dialog.STATUS_READY) {
    if (dialogs.length > 0 && dialogs[dialogs.length - 1].label === label) {
      dialogs[dialogs.length - 1].entities = entities;
      dialogs[dialogs.length - 1].status = status;
    } else {
      dialogs.push({ label, entities, status });
    }
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} dialogs - the dialogs
   * @param {Object[]} intents - the intents
   * @param {Object[]} entities - the entities
   */
  async updateDialogs(userId, dialogs, intents, entities) {
    console.log('DialogManager.updateDialogs', userId, dialogs, intents, entities);
    intents = this.filterIntents(intents);
    console.log('DialogManager.updateDialogs: intents', intents);
    if (intents.length > 0) {
      let nbComplex = 0;
      for (let i = 0; i < intents.length; i++) {
        if (this.getDialog(intents[i]).maxComplexity > 1) {
          nbComplex++;
        }
        this.pushDialog(
          dialogs,
          intents[i].label,
          entities,
          nbComplex > 1 ? Dialog.STATUS_BLOCKED : Dialog.STATUS_READY
        );
      }
    } else { // no intent detected
      if (dialogs.length === 0) {
        const dialog = await this.brain.userGet(userId, 'lastDialog') || 'default_dialog';
        console.log('DialogManager.updateDialogs: newDialog', dialog);
        this.pushDialog(dialogs, dialog, entities);
      } else {
        dialogs[dialogs.length - 1].entities = entities;
      }
    }
  }

  /**
   * Executes the dialogs.
   * @param {string} userId the user id
   * @param {Object[]} dialogs - the dialogs
   */
  async executeDialogs(userId, dialogs) {
    console.log('DialogManager.executeDialogs', userId, dialogs);
    const responses = [];
    while (dialogs.length > 0) {
      const dialog = dialogs[dialogs.length - 1];
      // eslint-disable-next-line no-await-in-loop
      await this.brain.userSet(userId, 'lastDialog', dialog.label);
      // eslint-disable-next-line no-await-in-loop
      dialog.status = await this
        .getDialog(dialog)
        .execute(userId, responses, dialog.entities || [], dialog.status);
      if (dialog.status === Dialog.STATUS_DISCARDED) {
        dialogs = dialogs.slice(0, -1);
        await this.brain.userSet(userId, 'lastDialog', null);
      } else if (dialog.status === Dialog.STATUS_COMPLETED) {
        dialogs = dialogs.slice(0, -1);
      } else { // ready or waiting
        break;
      }
    }
    await this.brain.userSet(userId, 'dialogs', dialogs);
    console.log('DialogManager.executeDialogs: responses', responses);
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
    await this.updateDialogs(userId, dialogs, intents, entities);
    return this.executeDialogs(userId, dialogs);
  }
}

module.exports = DialogManager;
