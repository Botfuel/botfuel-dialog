const fs = require('fs');
const logger = require('logtown')('DialogManager');
const Dialog = require('./dialogs/dialog');
const { DialogError } = require('./errors');

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
      throw new DialogError({
        dialog,
      });
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
  updateWithIntents(userId, dialogs, intents, entities) {
    logger.debug('updateWithIntents', userId, dialogs, intents, entities);
    intents = this.filterIntents(intents);
    logger.debug('updateWithIntents: intents', intents);
    let nbComplex = 0;
    const newDialogs = [];
    for (let i = 0; i < intents.length; i++) {
      if (this.getDialog(intents[i]).maxComplexity > 1) {
        nbComplex++;
      }
      const status = nbComplex > 1 ? Dialog.STATUS_BLOCKED : Dialog.STATUS_READY;
      const label = intents[i].label;
      newDialogs.push({ label, entities, status });
    }
    this.updateWithDialogs(userId, dialogs, newDialogs, entities);
  }

  /**
   * Updates the dialogs.
   * @param {String} userId - the user id
   * @param {Object} dialogs - the dialogs data
   * @param {Object[]} newDialogs - new dialogs to be added to the dialog stack
   * @param {Object[]} entities - the entities
   * @returns {void}
   */
  updateWithDialogs(userId, dialogs, newDialogs, entities) {
    logger.debug('updateWithDialogs', userId, dialogs, newDialogs, entities);
    while (newDialogs.length > 0) {
      const newDialog = newDialogs[newDialogs.length - 1];
      const length = dialogs.stack.length;
      if (length > 0 && dialogs.stack[length - 1].label === newDialog.label) {
        dialogs.stack[length - 1].entities = newDialog.entities;
        dialogs.stack[length - 1].status = newDialog.status || Dialog.STATUS_READY;
      } else {
        dialogs.stack.push(newDialog);
      }
      newDialogs = newDialogs.slice(0, -1);
    }
    if (dialogs.stack.length === 0) { // no intent detected
      dialogs.stack.push({
        label: dialogs.lastLabel || 'default_dialog',
        entities: entities || [],
        status: Dialog.STATUS_READY,
      });
    }
    if (entities) {
      dialogs.stack[dialogs.stack.length - 1].entities = entities;
    }
  }

  /**
   * Executes the dialogs.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} dialogs - the dialogs data
   * @returns {Promise.<void>}
   */
  async execute(adapter, userId, dialogs) {
    logger.debug('execute', '<adapter>', userId, dialogs);
    if (dialogs.stack.length === 0) {
      return dialogs;
    }
    const dialog = dialogs.stack[dialogs.stack.length - 1];
    // eslint-disable-next-line no-await-in-loop
    const dialogInstance = await this.getDialog(dialog);
    const dialogResult = await dialogInstance
      .execute(adapter, userId, dialog.entities || [], dialog.status);
    logger.debug('execute: dialogResult', dialogResult);
    const status = dialogResult.status || Dialog.STATUS_COMPLETED;
    const isComplex = dialogInstance.maxComplexity > 1;
    if (status === Dialog.STATUS_DISCARDED) {
      dialogs.stack = dialogs.stack.slice(0, -1);
      dialogs.lastLabel = null;
    } else if (status === Dialog.STATUS_COMPLETED) {
      dialogs.stack = dialogs.stack.slice(0, -1);
      if (isComplex) {
        dialogs.lastLabel = dialog.label;
      }
    } else if (status === Dialog.STATUS_CANCELED) {
      dialogs.stack = dialogs.stack.slice(0, -2);
      dialogs.lastLabel = null;
    } else { // ready or waiting
      dialog.status = status;
      // we don't want to execute another dialog
      // TODO: decide what to do if both a status and a dialog are provided
      return dialogs;
    }
    const newDialog = dialogResult.newDialog;
    logger.debug('execute: newDialog', newDialog);
    if (newDialog) {
      newDialog.status = Dialog.STATUS_READY;
      this.updateWithDialogs(userId, dialogs, [newDialog]);
    }
    return this.execute(adapter, userId, dialogs);
  }

  /**
   * Populates and executes the stack.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {String[]} intents - the intents
   * @param {Object[]} entities - the transient entities
   * @returns {Promise.<void>}
   */
  async executeIntents(adapter, userId, intents, entities) {
    logger.debug('execute', userId, intents, entities);
    try {
      const dialogs = await this.getDialogs(userId);
      this.updateWithIntents(userId, dialogs, intents, entities);
      await this.execute(adapter, userId, dialogs);
      return this.setDialogs(userId, dialogs);
    } catch (error) {
      logger.error('Could not execute intents');

      if (error instanceof DialogError) {
        const { dialog } = error;
        logger.error(`Could not resolve '${dialog.label}' dialog`);
        logger.error(`Make sure the '${dialog.label}' dialog file exists at ${process.cwd()}/src/dialogs/${dialog.label}.js`);

        process.exit(1);
      }

      throw error;
    }
  }

  /**
   * Populates and executes the stack.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} newDialogs - the new dialogs
   * @returns {Promise.<void>}
   */
  async executeDialogs(adapter, userId, newDialogs) {
    logger.debug('executeWithDialogs', userId, newDialogs);
    const dialogs = await this.getDialogs(userId);
    this.updateWithDialogs(userId, dialogs, newDialogs);
    await this.execute(adapter, userId, dialogs);
    return this.setDialogs(userId, dialogs);
  }
}

module.exports = DialogManager;
