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

const DEFAULT_DIALOG = {
  name: 'default',
  characteristics: {
    reentrant: false,
  },
  data: {},
  triggeredBy: 'dialog-manager',
};

/**
 * The dialog manager turns NLU output into a dialog stack. It executes the stack and returns the
 * bot messages
 */
class DialogManager extends Resolver {
  constructor(bot) {
    const { brain, config } = bot;

    super(config, 'dialog');

    this.bot = bot;
    this.brain = brain;
    this.adapterName = config.adapter.name;
  }

  getFilenames(name) {
    return [`${name}-${this.kind}.${this.adapterName}.js`, `${name}-${this.kind}.js`];
  }

  resolutionSucceeded(Resolved) {
    return new Resolved(this.bot, Resolved.params);
  }

  /**
   * Returns the last "reentrant" dialog to execute if no other dialog is found.
   * When the sentence itself does not contain enough information for the DialogManager
   * to compute a dialog, the DialogManager recalls the first reentrant dialog from the
   * stack of previous dialogs.
   */
  getLastReentrantDialog(previousDialogs) {
    logger.debug('getLastReentrantDialog', { previousDialogs });
    return previousDialogs
      .slice(0)
      .reverse()
      .find(dialog => this.resolve(dialog.name).characteristics.reentrant) || null;
  }

  /**
   * Get the last dialog from dialogs stack
   * @param dialogs
   * @returns {*}
   */
  getLastDialog(dialogs) {
    return dialogs.stack.length > 0 ? dialogs.stack[dialogs.stack.length - 1] : null;
  }

  /**
   * Returns the dialogs data (stack and previous dialogs).
   */
  async getDialogs(userId) {
    logger.debug('getDialogs', { userId });
    return this.brain.getDialogs(userId);
  }

  /**
   * Sets the dialogs data (stack and previous dialogs).
   */
  async setDialogs(userId, dialogs) {
    logger.debug('setDialogs', { userId, dialogs });
    await this.brain.setDialogs(userId, dialogs);
  }

  /**
   * Updates the dialogs.
   */
  updateWithClassificationResults(userId, dialogs, classificationResults, messageEntities) {
    logger.debug('updateWithClassificationResults', { userId, dialogs, classificationResults, messageEntities });
    let newDialog = null;
    if (classificationResults.length > 1) {
      newDialog = {
        name: 'classification-disambiguation',
        data: { classificationResults, messageEntities },
        triggeredBy: 'dialog-manager',
      };
    } else if (classificationResults.length === 1) {
      const lastDialog = this.getLastDialog(dialogs);
      if (
        lastDialog
        && lastDialog.name === classificationResults[0].name
        && messageEntities.length === 0
      ) {
        // if new intent is the same as previous with no new entity then trigger default dialog
        newDialog = DEFAULT_DIALOG;
      } else {
        newDialog = {
          name: classificationResults[0].name,
          data: classificationResults[0].isQnA()
            ? {
              answers: classificationResults[0].answers,
              label: classificationResults[0].label,
            } // TODO refactor (law of Demeter)
            : { messageEntities },
          triggeredBy: 'nlu',
        };
      }
    }

    if (newDialog) {
      this.updateWithDialog(dialogs, newDialog);
    } else {
      let lastDialog = this.getLastDialog(dialogs);
      if (lastDialog) {
        lastDialog.data.messageEntities = messageEntities;
      }
      if (messageEntities.length === 0) {
        lastDialog = DEFAULT_DIALOG;
        dialogs.stack.push(lastDialog);
      }
    }

    if (dialogs.stack.length === 0) {
      // no intent detected
      const lastDialog = this.getLastReentrantDialog(dialogs.previous) || DEFAULT_DIALOG;
      dialogs.stack.push({
        ...lastDialog,
        data: { messageEntities } || {},
      });
    }
  }

  /**
   * Updates the dialogs.
   * @param newDialog - new dialog to be added to the dialog stack
   */
  updateWithDialog(dialogs, newDialog) {
    logger.debug('updateWithDialog', { dialogs, newDialog });
    const lastDialog = this.getLastDialog(dialogs);
    if (lastDialog && lastDialog.name === newDialog.name) {
      lastDialog.data = newDialog.data;
    } else {
      dialogs.stack.push(newDialog);
    }
    logger.debug('updateWithDialog: updated', { dialogs });
  }

  /**
   * Applies an action to the dialogs object.
   * @param dialogs - the dialogs object to be updated
   * @returns The new dialogs object with its stack and previous arrays updated
   */
  applyAction(dialogs, action) {
    logger.debug('applyAction', { dialogs, action });
    let updatedDialogs = dialogs;
    const currentDialog = dialogs.stack[dialogs.stack.length - 1];
    const date = Date.now();
    switch (action.name) {
      case Dialog.ACTION_COMPLETE: {
        return {
          ...dialogs,
          stack: dialogs.stack.slice(0, -1),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };
      }
      case Dialog.ACTION_NEXT: {
        const { newDialog } = action;
        updatedDialogs = {
          ...dialogs,
          stack: dialogs.stack.slice(0, -1),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };
        this.updateWithDialog(updatedDialogs, newDialog);
        return updatedDialogs;
      }
      case Dialog.ACTION_NEW_CONVERSATION: {
        const { newDialog } = action;
        updatedDialogs = {
          ...dialogs,
          stack: [],
          previous: [],
          isNewConversation: true,
        };
        if (newDialog) {
          updatedDialogs.stack.push(newDialog);
        }
        return updatedDialogs;
      }
      case Dialog.ACTION_CANCEL: {
        const { newDialog } = action;
        updatedDialogs = {
          ...dialogs,
          stack: dialogs.stack.slice(0, -2),
          previous: [...dialogs.previous, { ...currentDialog, date }],
        };
        if (newDialog) {
          this.updateWithDialog(updatedDialogs, newDialog);
        }
        return updatedDialogs;
      }
      default:
        throw new DialogError({
          name: currentDialog,
          message: `Unknown action '${action.name}' in '${currentDialog.name}'`,
        });
    }
  }

  /**
   * Executes the dialogs.
   * @param botMessagesAccumulator - the bot messages from previous dialogs
   */
  async execute(userMessage, dialogs, botMessagesAccumulator = []) {
    logger.debug('execute', { userMessage, dialogs, botMessagesAccumulator });
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
        triggeredBy: 'dialog-manager',
      });
    } else {
      if (this.bot.config.dialogAliases && this.bot.config.dialogAliases[dialog.name]) {
        dialog.name = this.bot.config.dialogAliases[dialog.name];
      }
      const dialogInstance = this.resolve(dialog.name);
      const executeResult = await dialogInstance.execute(userMessage, dialog.data);
      const { action, botMessages: newBotMessages } = executeResult;
      botMessages = botMessages.concat(newBotMessages);
      logger.debug('execute', { action });
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
   */
  async executeClassificationResults(userMessage, classificationResults, messageEntities) {
    logger.debug('executeClassificationResults', { userMessage, classificationResults, messageEntities });
    const userId = userMessage.user;
    const dialogs = await this.getDialogs(userId);
    this.updateWithClassificationResults(userId, dialogs, classificationResults, messageEntities);
    const { dialogs: newDialogs, botMessages } = await this.execute(userMessage, dialogs);
    await this.setDialogs(userId, newDialogs);
    return botMessages;
  }

  /**
   * Populates and executes the stack.
   */
  async executeDialog(userMessage, newDialog) {
    logger.debug('executeDialog', { userMessage, newDialog });
    const userId = userMessage.user;
    const dialogs = await this.getDialogs(userId);
    this.updateWithDialog(dialogs, newDialog);
    const { dialogs: newDialogs, botMessages } = await this.execute(userMessage, dialogs);
    await this.setDialogs(userId, newDialogs);
    return botMessages;
  }
}

module.exports = DialogManager;
