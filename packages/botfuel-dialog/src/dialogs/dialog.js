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

const _ = require('lodash');
const logger = require('logtown')('Dialog');
const kebabCase = require('lodash/kebabCase');
const ViewResolver = require('../view-resolver');
const MissingImplementationError = require('../errors/missing-implementation-error');
const SdkError = require('../errors/sdk-error');
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

  /*
   * @param {Object} characteristics - the characteristics of the dialog
   * @param {Object} [parameters={}] - the optional dialog parameters
   */
  constructor(bot, characteristics = { reentrant: false }, parameters = {}) {
    logger.debug('constructor', { parameters });
    const { config, brain } = bot;
    this.brain = brain;
    this.characteristics = characteristics;
    this.parameters = parameters;
    this.viewResolver = new ViewResolver(config);
    this.name = this.getName();
    this.config = config.custom;
  }

  /**
   * Gets the dialog name.
   */
  getName() {
    return kebabCase(this.constructor.name).replace(/(dialog|-dialog)/g, '');
  }

  /**
   * Display messages by resolving the view associated to the dialog.
   * @param userMessage
   * @param data
   * @returns {Promise}
   */
  async display(userMessage, data) {
    logger.debug('display', { userMessage, data });
    return this.viewResolver.resolve(this.name).renderAsJson(userMessage, data);
  }

  /**
   * Executes the dialog.
   * @abstract
   * @param userMessage - the user message
   * @param data - the data
   * @returns {Promise.<Object>}
   */
  async execute(userMessage, data) { // eslint-disable-line no-unused-vars
    throw new MissingImplementationError();
  }

  /**
   * Builds an action.
   * indicating that the current dialog is completed and
   * providing the name of the next dialog to execute.
   * @param name - the name of the next dialog to execute
   * @param data - the data for the next dialog
   */
  triggerNext(name, data = {}) {
    if (!name) {
      throw new DialogError({
        message: 'You must provide a dialogName as a parameter to the nextDialog method.',
      });
    }
    return {
      newDialog: {
        name,
        data,
        triggeredBy: `${this.getName()}-dialog`,
      },
      name: Dialog.ACTION_NEXT,
    };
  }

  /**
   * Builds an action.
   * indicating that the previous dialog is canceled and
   * optionally providing the name of the next dialog.
   * @param name - the name of the next dialog (optional)
   */
  cancelPrevious(name) {
    if (name) {
      return {
        name: Dialog.ACTION_CANCEL,
        newDialog: {
          name,
          data: {},
          triggeredBy: `${this.getName()}-dialog`,
        },
      };
    }
    return {
      name: Dialog.ACTION_CANCEL,
    };
  }

  /**
   * Builds an action.
   * indicating that a new conversation should be started and
   * optionally providing the name of the next dialog.
   * @param name - the name of the next dialog (optional)
   * @param {Object} [data] - the data for the next dialog
   * @returns {Object} the action object
   */
  startNewConversation(name, data = {}) {
    if (name) {
      return {
        name: Dialog.ACTION_NEW_CONVERSATION,
        newDialog: {
          name,
          data,
          triggeredBy: `${this.getName()}-dialog`,
        },
      };
    }
    return {
      name: Dialog.ACTION_NEW_CONVERSATION,
    };
  }

  /*
   * Build an action
   * indicating that the current dialog is completed.
   */
  complete() {
    return {
      name: Dialog.ACTION_COMPLETE,
    };
  }

  /**
   * Builds an action.
   * indicating that current dialog should wait.
   */
  wait() {
    return {
      name: Dialog.ACTION_WAIT,
    };
  }

  /**
   * Hook to be overridden before dialog displays.
   * Returns null by default.
   * @param {Object} [userMessage] - the user message
   * @param {Object} data - the data
   * @returns - the extra data which will be added to the data passed to the view
   */
  async dialogWillDisplay(userMessage, data) {
    logger.debug('dialogWillDisplay', { userMessage, data });
    return null;
  }

  /**
   * Merges extraData to data if extraData is an object.
   * If extraData is a value then extend data with key "extraData".
   * @param extraData - the extra data
   * @param data - the data
   * @returns - the data with extraData combined
   */
  mergeData(extraData, data) {
    // if extraData is null
    if (!extraData) {
      return data;
    }
    // if extraData is an object
    if (typeof extraData === 'object' && !Array.isArray(extraData)) {
      if (data) {
        const commonKeys = _.intersection(Object.keys(data), Object.keys(extraData));
        if (commonKeys.length > 0) {
          throw new SdkError(
            `Your extraData contains keys already defined in the dialog data: ${commonKeys.toString()}`,
          );
        }
      }
      return { ...data, ...extraData };
    }
    // if extraData is a value
    return { ...data, extraData };
  }

  /**
   * Hook to be overridden before dialog completes.
   * @param userMessage - the user message
   * @param data - the data passed to the view
   */
  async dialogWillComplete(userMessage, data) {
    logger.debug('dialogWillComplete', { userMessage, data });
    return this.complete();
  }
}

module.exports = Dialog;
