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
   * @param {Object} bot - the bot
   */
  constructor(bot) {
    const { brain, config } = bot;

    super(config, 'dialog');

    this.bot = bot;
    this.brain = brain;
  }

  /** @inheritdoc */
  getFilenames(name) {
    return [`${name}-${this.kind}.${this.config.adapter.name}.js`, `${name}-${this.kind}.js`];
  }

  /** @inheritdoc */
  resolutionSucceeded(Resolved) {
    return new Resolved(this.bot, Resolved.params);
  }

  /**
   * Returns the last "reentrant" dialog to execute if no other dialog is found.
   * When the sentence itself does not contain enough information for the DialogManager
   * to compute a dialog, the DialogManager recalls the first reentrant dialog from the
   * stack of previous dialogs.
   * @param {Object[]} previousDialogs - the previous dialogs
   * @returns {String} a dialog name
   */
  getLastReentrantDialog(previousDialogs) {
    return (
      previousDialogs
        .slice(0)
        .reverse()
        .find(dialog => this.resolve(dialog.name).characteristics.reentrant) || null
    );
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
   * @param {Object[]} classificationResults - the classification results
   * @param {Object[]} messageEntities - the message entities
   * @returns {void}
   */
  updateWithClassificationResults(userId, dialogs, classificationResults, messageEntities) {
    logger.debug('updateWithClassificationResults', userId, dialogs, classificationResults);

    let newDialog = null;
    if (classificationResults.length > 1) {
      newDialog = {
        name: 'classification-disambiguation',
        data: { classificationResults, messageEntities },
      };
    } else if (classificationResults.length === 1) {
      newDialog = {
        name: classificationResults[0].name,
        data: classificationResults[0].isQnA()
          ? { answers: classificationResults[0].answers }
          : { messageEntities },
      };
    }

    if (newDialog) {
      this.updateWithDialog(dialogs, newDialog);
    } else {
      const lastDialog = dialogs.stack.length > 0 ? dialogs.stack[dialogs.stack.length - 1] : null;
      if (lastDialog) {
        lastDialog.data.messageEntities = messageEntities;
      }
    }

    if (dialogs.stack.length === 0) {
      // no intent detected
      const lastDialog = this.getLastReentrantDialog(dialogs.previous) || {
        name: 'default',
        characteristics: {
          reentrant: false,
        },
      };
      dialogs.stack.push({
        ...lastDialog,
        data: { messageEntities } || {},
      });
    }
  }

  /**
   * Updates the dialogs.
   * @param {Object} dialogs - the dialogs data
   * @param {Object} newDialog - new dialog to be added to the dialog stack
   * @returns {void}
   */
  updateWithDialog(dialogs, newDialog) {
    const lastDialog = dialogs.stack.length > 0 ? dialogs.stack[dialogs.stack.length - 1] : null;
    if (lastDialog && lastDialog.name === newDialog.name) {
      lastDialog.data = newDialog.data;
    } else {
      dialogs.stack.push(newDialog);
    }
    logger.debug('updateWithDialog: updated', dialogs);
  }

  /**
   * Applies an action to the dialogs object.
   * @async
   * @param {Object} dialogs - the dialogs object to be updated
   * @param {String} action - an action that indicates
   * how should the stack and previous dialogs be updated
   * @returns {Object} The new dialogs object with its stack and previous arrays updated
   */
  applyAction(dialogs, { name, newDialog }) {
    logger.debug('applyAction', dialogs, { name, newDialog });
    const currentDialog = dialogs.stack[dialogs.stack.length - 1];
    const date = Date.now();

    switch (name) {
      case Dialog.ACTION_CANCEL:
        dialogs = {
          ...dialogs,
          stack: dialogs.stack.slice(0, -2),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };
        if (newDialog) {
          this.updateWithDialog(dialogs, newDialog);
        }
        return dialogs;

      case Dialog.ACTION_COMPLETE:
        return {
          ...dialogs,
          stack: dialogs.stack.slice(0, -1),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };

      case Dialog.ACTION_NEXT:
        dialogs = {
          ...dialogs,
          stack: dialogs.stack.slice(0, -1),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };
        this.updateWithDialog(dialogs, newDialog);
        return dialogs;

      case Dialog.ACTION_NEW_CONVERSATION:
        dialogs = {
          ...dialogs,
          stack: [],
          previous: [],
          isNewConversation: true,
        };
        if (newDialog) {
          dialogs.stack.push(newDialog);
        }
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
   * @param {Object} userMessage - the user message
   * @param {Object[]} dialogs - the dialogs data
   * @param {Object[]} botMessagesAccumulator - the bot messages from previous dialogs
   * @returns {Promise.<Object[]>}
   */
  async execute(userMessage, dialogs, botMessagesAccumulator = []) {
    logger.debug('execute', userMessage, dialogs, botMessagesAccumulator);

    let botMessages = botMessagesAccumulator;

    if (dialogs.stack.length === 0) {
      return {
        dialogs,
        botMessages,
      };
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
        data: {},
      });
    } else {
      const dialogInstance = this.resolve(dialog.name);
      const { action, botMessages: newBotMessages } = await dialogInstance.execute(
        userMessage,
        dialog.data,
      );
      botMessages = botMessages.concat(newBotMessages);

      logger.debug('execute: action', action);
      if (action.name === Dialog.ACTION_WAIT) {
        return {
          dialogs,
          botMessages,
        };
      }
      dialogs = await this.applyAction(dialogs, action);
    }
    return this.execute(userMessage, dialogs, botMessages);
  }

  /**
   * Executes when receiving the classification results and message entities.
   * @param {Object} userMessage - the user message
   * @param {Object[]} classificationResults - the classification results from trainer
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<Object[]>}
   */
  async executeClassificationResults(userMessage, classificationResults, messageEntities) {
    logger.debug('classificationResult', userMessage, classificationResults, messageEntities);
    const userId = userMessage.user;
    const dialogs = await this.getDialogs(userId);
    this.updateWithClassificationResults(userId, dialogs, classificationResults, messageEntities);
    const { dialogs: newDialogs, botMessages } = await this.execute(userMessage, dialogs);
    await this.setDialogs(userId, newDialogs);
    return botMessages;
  }

  /**
   * Populates and executes the stack.
   * @param {Object} userMessage - the user message
   * @param {Object[]} newDialog - the new dialogs
   * @returns {Promise.<Object[]>}
   */
  async executeDialog(userMessage, newDialog) {
    logger.debug('executeDialog', userMessage, newDialog);
    const userId = userMessage.user;
    const dialogs = await this.getDialogs(userId);
    this.updateWithDialog(dialogs, newDialog);
    const { dialogs: newDialogs, botMessages } = await this.execute(userMessage, dialogs);
    await this.setDialogs(userId, newDialogs);
    return botMessages;
  }
}

module.exports = DialogManager;
