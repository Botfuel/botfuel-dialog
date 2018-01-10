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

const logger = require('logtown')('DialogManager');
const Resolver = require('./resolver');
const Dialog = require('./dialogs/dialog');
const DialogError = require('./errors/dialog-error');

/**
 * The dialog manager turns NLU output into a dialog stack.
 *
 * The dialog manager has access to:
 * - the bot {@link Brain}.
 */
class DialogManager extends Resolver {
  /**
   * @constructor
   * @param {Object} brain - the bot brain
   * @param {Object} config - the bot config
   */
  constructor(brain, config) {
    super(config, 'dialog');
    this.brain = brain;
  }

  /** @inheritdoc */
  getPaths(name) {
    logger.debug('getPaths', name);
    return [
      `${this.path}/${name}-${this.kind}.${this.config.adapter}.js`,
      `${this.path}/${name}-${this.kind}.js`,
      `${this.localPath}/${name}-${this.kind}.${this.config.adapter}.js`,
      `${this.localPath}/${name}-${this.kind}.js`,
    ];
  }

  /** @inheritdoc */
  resolutionSucceeded(Resolved) {
    return new Resolved(this.config, this.brain, Resolved.params);
  }

  /**
   * Sorts intents
   * @param {Object[]} intents - the intents
   * @returns {Object[]} the sorted intents
   */
  sortIntents(intents) {
    logger.debug('sortIntents', intents);
    return intents.sort((intent1, intent2) => {
      const reentrant1 = this.resolve(intent1.name).characteristics.reentrant;
      const reentrant2 = this.resolve(intent2.name).characteristics.reentrant;
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
      const dialogInstance = this.resolve(dialog.name);
      if (dialogInstance.characteristics.reentrant) {
        return dialog;
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
    return this.brain.getDialogs(userId);
  }

  /**
   * Sets the dialogs data (stack and previous dialogs).
   * @param {String} userId - the user id
   * @param {Object} dialogs - the dialogs data
   * @returns {void}
   */
  async setDialogs(userId, dialogs) {
    logger.debug('setDialogs', userId, dialogs);
    await this.brain.setDialogs(userId, dialogs);
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
    intents = this.sortIntents(intents);
    logger.debug('updateWithIntents: intents', intents);
    let nb = 0;
    const newDialogs = [];
    for (let i = 0; i < intents.length; i++) {
      const name = intents[i].name;
      const characteristics = this.resolve(name).characteristics;
      if (characteristics.reentrant) {
        nb++;
      }
      newDialogs.push({
        name,
        characteristics,
        entities,
        blocked: nb > 1,
      });
    }
    this.updateWithDialogs(dialogs, newDialogs);
    if (dialogs.stack.length === 0) {
      // no intent detected
      const lastDialog = this.getLastDialog(dialogs.previous) || {
        name: 'default',
        characteristics: {
          reentrant: false,
        },
      };
      dialogs.stack.push({
        ...lastDialog,
        entities: entities || [],
      });
    }
    if (entities) {
      dialogs.stack[dialogs.stack.length - 1].entities = entities;
    }
  }

  /**
   * Updates the dialogs.
   * @param {Object} dialogs - the dialogs data
   * @param {Object[]} newDialogs - new dialogs to be added to the dialog stack
   * @returns {void}
   */
  updateWithDialogs(dialogs, newDialogs) {
    for (let i = newDialogs.length - 1; i >= 0; i--) {
      const newDialog = newDialogs[i];
      const lastIndex = dialogs.stack.length - 1;
      const lastDialog = lastIndex >= 0 ? dialogs.stack[lastIndex] : null;
      if (lastDialog && lastDialog.name === newDialog.name) {
        lastDialog.entities = newDialog.entities;
      } else {
        dialogs.stack.push(newDialog);
      }
    }
  }

  /**
   * Applies an action to the dialogs object.
   * @async
   * @param {Object} dialogs - the dialogs object to be updated
   * @param {String} action - an action that indicates
   * how should the stack and previous dialogs be updated
   * @returns {Promise.<Object>} The new dialogs object with its stack and previous arrays updated
   */
  applyAction(dialogs, { name, newDialog }) {
    logger.debug('applyAction', dialogs, { name, newDialog });
    const currentDialog = dialogs.stack[dialogs.stack.length - 1];
    const previousDialog = dialogs.stack[dialogs.stack.length - 2];
    const date = Date.now();

    switch (name) {
      case Dialog.ACTION_CANCEL:
        logger.debug('applyAction: cancelling previous dialog', previousDialog);
        dialogs = {
          stack: dialogs.stack.slice(0, -2),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };
        if (newDialog) {
          this.updateWithDialogs(dialogs, [newDialog]);
        }
        return dialogs;

      case Dialog.ACTION_COMPLETE:
        return {
          stack: dialogs.stack.slice(0, -1),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };

      case Dialog.ACTION_NEXT:
        dialogs = {
          stack: dialogs.stack.slice(0, -1),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };
        this.updateWithDialogs(dialogs, [newDialog]);
        return dialogs;

      default:
        throw new DialogError({
          name: currentDialog,
          message: `Unknown action '${name}' in '${currentDialog.name}'`,
        });
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
    if (dialog.blocked) {
      dialog.blocked = false;
      const confirmationDialogName = this.resolve(`${dialog.name}-confirmation`)
        ? `${dialog.name}-confirmation`
        : 'confirmation';
      dialogs.stack.push({
        name: confirmationDialogName,
        characteristics: {
          reentrant: false,
        },
        entities: [],
      });
    } else {
      const action = await this.resolve(dialog.name).execute(adapter, userId, dialog.entities);
      logger.debug('execute: action', action);
      if (action.name === Dialog.ACTION_WAIT) {
        return dialogs;
      }
      dialogs = await this.applyAction(dialogs, action);
    }
    return this.execute(adapter, userId, dialogs);
  }

  /**
   * Populates and executes the stack.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {String[]} intents - the intents
   * @param {Object[]} entities - the transient entities
   * @returns {void}
   */
  async executeIntents(adapter, userId, intents, entities) {
    logger.debug('execute', userId, intents, entities);
    const dialogs = await this.getDialogs(userId);
    this.updateWithIntents(userId, dialogs, intents, entities);
    await this.setDialogs(userId, await this.execute(adapter, userId, dialogs));
  }

  /**
   * Populates and executes the stack.
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {Object[]} newDialogs - the new dialogs
   * @returns {void}
   */
  async executeDialogs(adapter, userId, newDialogs) {
    logger.debug('executeWithDialogs', userId, newDialogs);
    const dialogs = await this.getDialogs(userId);
    this.updateWithDialogs(dialogs, newDialogs);
    await this.setDialogs(userId, await this.execute(adapter, userId, dialogs));
  }
}

module.exports = DialogManager;
