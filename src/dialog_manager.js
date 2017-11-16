const fs = require('fs');
const logger = require('logtown')('DialogManager');
const Dialog = require('./dialogs/dialog');

/**
 * Dialog manager turns NLU output into a dialog stack
 * A Dialog manager has:
 * - an intent threshold
 * The Dialog manager have access to:
 * - the bot {@link Brain},
 */
class DialogManager {
  /**
   * @constructor
   * @param {Object} brain - the bot brain
   * @param {Object} config - the bot config
   */
  constructor(brain, config) {
    logger.debug('constructor');
    this.brain = brain;
    this.config = config;
    this.intentThreshold = this.config.intentThreshold || 0.8;
  }

  /**
   * Gets dialog path
   * @param {String} label - the dialog's label
   * @returns {String|null} - the dialog path if found or null
   */
  getDialogPath(label) {
    logger.debug('getDialogPath', label);
    const paths = [
      `${this.config.path}/src/dialogs/${label}.${this.config.adapter}`,
      `${this.config.path}/src/dialogs/${label}`,
      `${__dirname}/dialogs/${label}.${this.config.adapter}`,
      `${__dirname}/dialogs/${label}`,
    ];
    for (const path of paths) {
      logger.debug('getDialogPath: path', path);
      if (fs.existsSync(`${path}.js`)) {
        return path;
      }
    }
    return null;
  }

  /**
   * Gets a dialog and instantiates it
   * @param {Object} dialog - the dialog
   * @returns {Dialog} - the dialog instance
   */
  getDialog(dialog) {
    logger.debug('getDialog', dialog);
    const path = this.getDialogPath(dialog.label);
    if (path === null) {
      return null;
    }
    const DialogConstructor = require(path);
    return new DialogConstructor(this.config, this.brain, DialogConstructor.params);
  }

  /**
   * Filters and sorts intents
   * @param {Object[]} intents - the intents
   * @returns {Object[]} the filtered and sorted intents
   */
  filterIntents(intents) {
    logger.debug('filterIntents', intents);
    return intents
      .filter(intent => intent.value > this.intentThreshold)
      .slice(0, 2)
      .sort((intent1, intent2) => {
        const dialog1 = this.getDialog(intent1);
        const dialog2 = this.getDialog(intent2);
        return dialog1.maxComplexity - dialog2.maxComplexity;
      });
  }

  /**
   * Updates the dialogs.
   * @param {String} userId - the user id
   * @param {Object[]} dialogs - the dialogs
   * @param {Object[]} intents - the intents
   * @param {Object[]} entities - the entities
   * @returns {void}
   */
  async updateDialogs(userId, dialogs, intents, entities) {
    logger.debug('updateDialogs', userId, dialogs, intents, entities);
    intents = this.filterIntents(intents);
    logger.debug('updateDialogs: intents', intents);
    if (intents.length > 0) {
      let nbComplex = 0;
      let newDialogs = [];
      for (let i = 0; i < intents.length; i++) {
        if (this.getDialog(intents[i]).maxComplexity > 1) {
          nbComplex++;
        }
        const status = nbComplex > 1 ? Dialog.STATUS_BLOCKED : Dialog.STATUS_READY;
        const label = intents[i].label;
        newDialogs.push({ label, entities, status });
      }
      logger.debug('updateDialogs: newDialogs', newDialogs);
      while (newDialogs.length > 0) {
        const newDialog = newDialogs[newDialogs.length - 1];
        if (dialogs.length > 0 && dialogs[dialogs.length - 1].label === newDialog.label) {
          dialogs[dialogs.length - 1].entities = newDialog.entities;
          dialogs[dialogs.length - 1].status = newDialog.status;
        } else {
          dialogs.push(newDialog);
        }
        newDialogs = newDialogs.slice(0, -1);
      }
    } else if (dialogs.length === 0) { // no intent detected
      const label = await this.brain.userGet(userId, 'lastDialog') || 'default_dialog';
      logger.debug('updateDialogs: newDialog', label);
      dialogs.push({ label, entities, status: Dialog.STATUS_READY });
    } else {
      dialogs[dialogs.length - 1].entities = entities;
    }
  }

  /**
   * Executes the dialogs.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} dialogs - the dialogs
   * @returns {Promise.<void>}
   */
  async executeDialogs(adapter, userId, dialogs) {
    logger.debug('executeDialogs', userId, dialogs);
    while (dialogs.length > 0) {
      const dialog = dialogs[dialogs.length - 1];
      // eslint-disable-next-line no-await-in-loop
      const dialogInstance = await this.getDialog(dialog);
      if (dialogInstance.maxComplexity > 1) {
        // eslint-disable-next-line no-await-in-loop
        await this.brain.userSet(userId, 'lastDialog', dialog.label);
      }
      // eslint-disable-next-line no-await-in-loop
      dialog.status = await dialogInstance
        .execute(adapter, userId, dialog.entities || [], dialog.status);
      if (dialog.status === Dialog.STATUS_DISCARDED) {
        dialogs = dialogs.slice(0, -1);
        // eslint-disable-next-line no-await-in-loop
        await this.brain.userSet(userId, 'lastDialog', null);
      } else if (dialog.status === Dialog.STATUS_COMPLETED) {
        dialogs = dialogs.slice(0, -1);
      } else { // ready or waiting
        break;
      }
    }
    await this.brain.userSet(userId, 'dialogs', dialogs);
  }

  /**
   * Populates and executes the stack.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {String[]} intents - the intents
   * @param {Object[]} entities - the transient entities
   * @returns {Promise.<void>}
   */
  async execute(adapter, userId, intents, entities) {
    logger.debug('execute', userId, intents, entities);
    const dialogs = await this.brain.userGet(userId, 'dialogs');
    await this.updateDialogs(userId, dialogs, intents, entities);
    await this.executeDialogs(adapter, userId, dialogs);
  }
}

module.exports = DialogManager;
