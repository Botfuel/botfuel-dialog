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
   * @param {String} userId - the user id
   * used by the view to customize its behaviour
   * @param {Object} [data] - data used at display time
   * @returns {Promise.<void>}
   */
  async display(adapter, userId, data) {
    logger.debug('display', userId, data);
    const botMessages = this.viewResolver
      .resolve(this.name)
      .renderAsJson(adapter.bot.id, userId, data);
    return adapter.send(botMessages);
  }

  /**
   * Executes the dialog.
   * @abstract
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {String[]} messageEntities - the message entities
   * @returns {Promise.<Object>}
   */
  async execute() {
    throw new MissingImplementationError();
  }

  /**
   * Builds an object that sets the current dialog as completed
   * and provides the name of the next dialog.
   * @param {String} dialogName - the name of the next dialog
   * @param {Object[]} dialogEntities - the entities for the next dialog
   * @returns {Object} contains
   *   - a newDialog object thas has a name
   *   - an action set to ACTION_NEXT
   */
  triggerNext(dialogName, dialogEntities = []) {
    if (!dialogName) {
      throw new DialogError({
        message: 'You must provide a dialogName as a parameter to the nextDialog method.',
      });
    }

    return {
      newDialog: {
        name: dialogName,
        entities: dialogEntities,
      },
      name: this.ACTION_NEXT,
    };
  }

  /**
   * Builds an object that sets the previous dialog as canceled
   * and optionally provides name of the next dialog.
   * @param {String} [dialogName] - the name of the next dialog (optional)
   * @returns {Object} contains
   *   - a newDialog object thas has a name (optional)
   *   - an action set to ACTION_CANCEL
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
   * Builds an action's object that starts a new conversation
   * and optionally provides name of the next dialog to start with.
   * @param {String} [dialogName] - the name of the next dialog (optional)
   * @param {Object[]} [dialogEntities] - the entities for the next dialog
   * @returns {Object} contains
   *   - an action set to ACTION_NEW_CONVERSATION
   *   - a newDialog object thas has a name (optional)
   */
  startNewConversation(dialogName, dialogEntities = []) {
    return {
      name: this.ACTION_NEW_CONVERSATION,
      ...(dialogName && {
        newDialog: {
          name: dialogName,
          entities: dialogEntities,
        },
      }),
    };
  }

  /**
   * Builds an object that sets current dialog as completed.
   * @returns {Object} contains
   *   - an action set to ACTION_COMPLETE
   */
  complete() {
    return {
      name: this.ACTION_COMPLETE,
    };
  }

  /**
   * Builds an object that indicates that current dialog should wait.
   * @returns {Object} contains
   *   - an action set to ACTION_WAIT
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
   * @param {String} [userId] - the user id
   * @param {Object} [dialogData] - the dialog data
   * @returns {Promise.<*>} the data extended to the display method
   */
  async dialogWillDisplay(userId, dialogData) {
    logger.debug('dialogWillDisplay', userId, dialogData);
    return null;
  }

  /**
   * Hook to be overridden before dialog completes.
   * Does nothing by default.
   * @async
   * @param {String} [userId] - the user id
   * @param {Object} [dialogData] - the dialog data
   * @returns {Promise.<*>}
   */
  async dialogWillComplete(userId, dialogData) {
    logger.debug('dialogWillComplete', userId, dialogData);
  }
}

module.exports = Dialog;
