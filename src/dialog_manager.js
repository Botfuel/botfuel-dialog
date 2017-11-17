const fs = require('fs');
const logger = require('logtown')('DialogManager');
const Dialog = require('./dialogs/dialog');

/**
 * The dialog manager turns NLU output into a dialog stack.
 *
 * A dialog manager has:
 * - an intent threshold.
 *
 * The dialog manager has access to:
 * - the bot {@link Brain}.
 */
class DialogManager {
  /**
   * @constructor
   * @param {Object} brain - the bot brain
   * @param {Object} config - the bot config
   */
  constructor(brain, config) {
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
   * Returns the dialogs data (stack and label of last dialog).
   * @param {String} userId - the user id
   * @returns {Promise.<Object[]>} the data
   */
  async getDialogs(userId) {
    logger.debug('getDialogs', userId);
    return this.brain.userGet(userId, 'dialogs');
  }

  /**
   * Sets the dialogs data (stack and label of last dialog).
   * @param {String} userId - the user id
   * @param {Object} dialogs - the dialogs data
   * @returns {void}
   */
  async setDialogs(userId, dialogs) {
    logger.debug('setDialogs', userId, dialogs);
    return this.brain.userSet(userId, 'dialogs', dialogs);
  }

  /**
   * Updates the dialogs.
   * @param {String} userId - the user id
   * @param {Object} dialogs - the dialogs data
   * @param {Object[]} intents - the intents
   * @param {Object[]} entities - the entities
   * @returns {void}
   */
  updateDialogs(userId, dialogs, intents, entities) {
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
        const length = dialogs.stack.length;
        if (length > 0 && dialogs.stack[length - 1].label === newDialog.label) {
          dialogs.stack[length - 1].entities = newDialog.entities;
          dialogs.stack[length - 1].status = newDialog.status;
        } else {
          dialogs.stack.push(newDialog);
        }
        newDialogs = newDialogs.slice(0, -1);
      }
    } else {
      const length = dialogs.stack.length;
      if (length === 0) { // no intent detected
        dialogs.stack.push({
          label: dialogs.lastLabel || 'default_dialog',
          entities,
          status: Dialog.STATUS_READY,
        });
      } else {
        dialogs.stack[length - 1].entities = entities;
      }
    }
  }

  /**
   * Executes the dialogs and saves the dialogs object.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} dialogs - the dialogs data
   * @returns {Promise.<void>}
   */
  async executeDialogs(adapter, userId, dialogs) {
    await this.executeDialogsRec(adapter, userId, dialogs);
    return this.setDialogs(userId, dialogs);
  }

  /**
   * Executes the dialogs.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} dialogs - the dialogs data
   * @returns {Promise.<void>}
   */
  async executeDialogsRec(adapter, userId, dialogs) {
    logger.debug('executeDialogs', '<adapter>', userId, dialogs);
    if (dialogs.stack.length === 0) {
      return dialogs;
    }
    const dialog = dialogs.stack[dialogs.stack.length - 1];
    // eslint-disable-next-line no-await-in-loop
    const { status, isComplex } = await this.executeDialog(adapter, userId, dialogs, dialog);
    if (status === Dialog.STATUS_DISCARDED) {
      logger.debug('executeDialogs: status discarded start');
      dialogs.stack = dialogs.stack.slice(0, -1);
      dialogs.lastLabel = null;
      logger.debug('executeDialogs: status discarded end');
    } else if (status === Dialog.STATUS_COMPLETED) {
      logger.debug('executeDialogs: status completed start');
      dialogs.stack = dialogs.stack.slice(0, -1);
      if (isComplex) {
        dialogs.lastLabel = dialog.label;
      }
      logger.debug('executeDialogs: status completed end');
    } else { // ready or waiting
      logger.debug('executeDialogs: status ready/waiting start');
      dialog.status = status;
      logger.debug('executeDialogs: status ready/waiting end');
      return dialogs; // we don't want to execute another dialog
    }
    return this.executeDialogsRec(adapter, userId, dialogs);
  }

  /**
   * Executes a dialog.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} dialogs - the dialogs data
   * @param {String} dialog - the dialog label
   * @returns {Promise.<Object>}
   */
  async executeDialog(adapter, userId, dialogs, dialog) {
    logger.debug('executeDialog', '<adapter>', userId, dialogs, dialog);
    const dialogInstance = await this.getDialog(dialog);
    const status = await dialogInstance
          .execute(adapter, userId, dialog.entities || [], dialog.status);
    const isComplex = dialogInstance.maxComplexity > 1;
    return { status, isComplex };
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
    const dialogs = await this.getDialogs(userId);
    this.updateDialogs(userId, dialogs, intents, entities);
    await this.executeDialogs(adapter, userId, dialogs);
    return this.setDialogs(userId, dialogs);
  }
}

module.exports = DialogManager;
