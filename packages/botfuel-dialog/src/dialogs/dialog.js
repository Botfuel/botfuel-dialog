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

const logger = require('logtown')('Dialog');
const kebabCase = require('lodash/kebabCase');
const ViewResolver = require('../view-resolver');
const MissingImplementationError = require('../errors/missing-implementation-error');
const DialogError = require('../errors/dialog-error');

/**
 * A dialog is responsible for calling its associated view with the right parameters.
 *
 * The dialog and its associated view share the same name.
 * The dialog optionally accesses the brain and
 * then calls the view with the right parameters for the rendering.
 * At the end of the execution, an object is returned which contains
 * either the new status of the dialog or or a new dialog to execute.
 */
class Dialog {
  static ACTION_CANCEL = 'cancel';
  static ACTION_COMPLETE = 'complete';
  static ACTION_WAIT = 'wait';
  static ACTION_NEXT = 'next';
  static ACTION_NEW_CONVERSATION = 'new_conversation';

  /**
   * Indicates that this dialog is cancelling the previous one.
   */
  get ACTION_CANCEL() {
    return Dialog.ACTION_CANCEL;
  }

  /**
   * Indicates that this dialog is completed.
   */
  get ACTION_COMPLETE() {
    return Dialog.ACTION_COMPLETE;
  }

  /**
   * Indicates that this dialog should wait.
   */
  get ACTION_WAIT() {
    return Dialog.ACTION_WAIT;
  }

  /**
   * Indicates that this dialog is calling the next one.
   */
  get ACTION_NEXT() {
    return Dialog.ACTION_NEXT;
  }

  /**
   * Reset dialogs.
   */
  get ACTION_NEW_CONVERSATION() {
    return Dialog.ACTION_NEW_CONVERSATION;
  }

  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   * @param {Object} characteristics - the characteristics of the dialog
   * @param {Object} [parameters={}] - the optional dialog parameters
   */
  constructor(config, brain, characteristics = { reentrant: false }, parameters = {}) {
    logger.debug('constructor', parameters);
    this.brain = brain;
    this.characteristics = characteristics;
    this.parameters = parameters;
    this.viewResolver = new ViewResolver(config);
    this.name = this.getName();
  }

  /**
   * Gets dialog name
   * @returns {String} the dialog name
   */
  getName() {
    return kebabCase(this.constructor.name).replace(/(dialog|-dialog)/g, ''); // TODO: is this correct?
  }

  /**
   * Displays messages by resolving the view associated to the dialog.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {Object} userMessage - the user message
   * @param {Object} [data] - data used at display time
   * @returns {Promise.<void>}
   */
  async display(adapter, userMessage, data) {
    logger.debug('display', userMessage, data);
    const botMessages = this.viewResolver.resolve(this.name).renderAsJson(userMessage, data);
    return adapter.send(botMessages, userMessage);
  }

  /**
   * Executes the dialog.
   * @abstract
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {Object} userMessage - the user message
   * @param {Object} data - the data
   * @returns {Promise.<Object>}
   */
  async execute() {
    throw new MissingImplementationError();
  }

  /**
   * Builds an action
   * indicating that the current dialog is completed and
   * providing the name of the next dialog to execute.
   * @param {String} dialogName - the name of the next dialog to execute
   * @param {Object} data - the data for the next dialog
   * @returns {Object} the action object
   */
  triggerNext(dialogName, data = {}) {
    if (!dialogName) {
      throw new DialogError({
        message: 'You must provide a dialogName as a parameter to the nextDialog method.',
      });
    }
    return {
      newDialog: {
        name: dialogName,
        data,
      },
      name: this.ACTION_NEXT,
    };
  }

  /**
   * Builds an action
   * indicating that the previous dialog is canceled and
   * optionally providing the name of the next dialog.
   * @param {String} [dialogName] - the name of the next dialog (optional)
   * @returns {Object} the action object
   */
  cancelPrevious(dialogName) {
    return {
      name: this.ACTION_CANCEL,
      ...(dialogName && {
        newDialog: {
          name: dialogName,
        },
      }),
    };
  }

  /**
   * Builds an action
   * indicating that a new conversation should be started and
   * optionally providing the name of the next dialog.
   * @param {String} [dialogName] - the name of the next dialog (optional)
   * @param {Object} [data] - the data for the next dialog
   * @returns {Object} the action object
   */
  startNewConversation(dialogName, data = {}) {
    return {
      name: this.ACTION_NEW_CONVERSATION,
      ...(dialogName && {
        newDialog: {
          name: dialogName,
          data,
        },
      }),
    };
  }

  /**
   * Builds an action
   * indicating that the current dialog is completed.
   * @returns {Object} the action object
   */
  complete() {
    return {
      name: this.ACTION_COMPLETE,
    };
  }

  /**
   * Builds an action
   * indicating that current dialog should wait.
   * @returns {Object} the action object
   */
  wait() {
    return {
      name: this.ACTION_WAIT,
    };
  }

  /**
   * Hook to be overridden before dialog displays.
   * Returns null by default.
   * @async
   * @param {Object} [userMessage] - the user message
   * @param {Object} [dialogData] - the dialog data
   * @returns {Promise.<*>} some data (will be passed to the display method with the extraData key)
   */
  async dialogWillDisplay(userMessage, dialogData) {
    logger.debug('dialogWillDisplay', userMessage, dialogData);
    return null;
  }

  /**
   * Hook to be overridden before dialog completes.
   * Does nothing by default.
   * @async
   * @param {Object} [userMessage] - the user message
   * @param {Object} [dialogData] - the dialog data
   * @returns {Promise.<*>}
   */
  async dialogWillComplete(userMessage, dialogData) {
    logger.debug('dialogWillComplete', userMessage, dialogData);
  }
}

module.exports = Dialog;
