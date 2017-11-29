/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
   * @param {String} name - the dialog's name
   * @returns {String|null} - the dialog path if found or null
   */
  getDialogPath(name) {
    logger.debug('getDialogPath', name);
    const paths = [
      `${this.config.path}/src/dialogs/${name}.${this.config.adapter}`,
      `${this.config.path}/src/dialogs/${name}`,
      `${__dirname}/dialogs/${name}.${this.config.adapter}`,
      `${__dirname}/dialogs/${name}`,
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
    // @TODO: fix here we can have intents or dialogs, it's really confusing
    if (Object.hasOwnProperty.call(dialog, 'label') && !Object.hasOwnProperty.call(dialog, 'name')) {
      dialog.name = dialog.label;
    }
    const path = this.getDialogPath(dialog.name);
    if (path) {
      const DialogConstructor = require(path);
      return new DialogConstructor(this.config, this.brain, DialogConstructor.params);
    }
    logger.error(`Could not resolve '${dialog.name}' dialog`);
    logger.error(`Make sure the '${dialog.name}' dialog file exists at ${process.cwd()}/src/dialogs/${dialog.name}.js`);
    throw new DialogError({ dialog });
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
        const reentrant1 = dialog1.characteristics.reentrant;
        const reentrant2 = dialog2.characteristics.reentrant;
        if (reentrant1 && !reentrant2) {
          return 1;
        }
        if (!reentrant1 && reentrant2) {
          return -1;
        }
        return 0;
      });
  }

  /**
   * Returns the last dialog to execute if no other dialog is found.
   * @param {Object[]} previousDialogs - the previous dialogs
   * @returns {String} a dialog name
   */
  getLastDialog(previousDialogs) {
    for (let i = previousDialogs.length - 1; i >= 0; i--) {
      const dialog = previousDialogs[i];
      if ((dialog.status === Dialog.STATUS_COMPLETED) && dialog.characteristics.reentrant) {
        return dialog.name;
      }
    }
    return null;
  }

  /**
   * Returns the dialogs data (stack and previous dialogs).
   * @param {String} userId - the user id
   * @returns {Promise.<Object[]>} the data
   */
  async getDialogs(userId) {
    logger.debug('getDialogs', userId);
    return this.brain.userGet(userId, 'dialogs');
  }

  /**
   * Sets the dialogs data (stack and previous dialogs).
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
    let nb = 0;
    const newDialogs = [];
    for (let i = 0; i < intents.length; i++) {
      const intent = intents[i];
      if (this.getDialog(intent).characteristics.reentrant) {
        nb++;
      }
      const status = nb > 1 ? Dialog.STATUS_BLOCKED : Dialog.STATUS_READY;
      const name = intent.name;
      newDialogs.push({ name, entities, status });
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
    for (let i = newDialogs.length - 1; i >= 0; i--) {
      const newDialog = newDialogs[i];
      const lastIndex = dialogs.stack.length - 1;
      const lastDialog = lastIndex >= 0 ? dialogs.stack[lastIndex] : null;
      if (lastDialog && lastDialog.name === newDialog.name) {
        lastDialog.entities = newDialog.entities;
        lastDialog.status = newDialog.status || Dialog.STATUS_READY;
      } else {
        dialogs.stack.push(newDialog);
      }
    }
    if (dialogs.stack.length === 0) { // no intent detected
      dialogs.stack.push({
        name: this.getLastDialog(dialogs.previous) || 'default-dialog',
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
    const dialogInstance = await this.getDialog(dialog);
    const dialogResult = await dialogInstance
      .execute(adapter, userId, dialog.entities, dialog.status);
    logger.debug('execute: dialogResult', dialogResult);
    const status = dialogResult.status || Dialog.STATUS_COMPLETED;
    if (status === Dialog.STATUS_DISCARDED || status === Dialog.STATUS_COMPLETED) {
      dialogs.stack = dialogs.stack.slice(0, -1);
      dialogs.previous.push({
        name: dialog.name,
        status: dialog.status,
        characteristics: dialogInstance.characteristics,
        date: Date.now(),
      });
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
    const dialogs = await this.getDialogs(userId);
    this.updateWithIntents(userId, dialogs, intents, entities);
    await this.execute(adapter, userId, dialogs);
    return this.setDialogs(userId, dialogs);
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
