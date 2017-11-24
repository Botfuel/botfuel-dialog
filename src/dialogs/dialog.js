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
const ViewManager = require('../view-manager');
const { MissingImplementationError } = require('../errors');

/**
 * A dialog is responsible for calling its associated view with the right parameters.
 *
 * The dialog and its associated view share the same name.
 * The dialog optionally accesses the brain and
 * then calls the view with the right parameters for the rendering.
 * At the end of the execution, an object is returned which contains
 * either the new status of the dialog or or a new dialog to execute.
 *
 * The complexity of a dialog is expected number of turns in the conversation.
 * For example,
 * a dialog that says 'Hello' has a complexity of 1
 * while a dialog that prompts the user to enter n entities has roughly a complexity of n.
 * It is used by the {@link DialogManager} for scheduling the dialogs.
 */
class Dialog {
  // TODO: move some specific statuses out of this class
  static STATUS_BLOCKED = 'blocked';
  static STATUS_COMPLETED = 'completed';
  static STATUS_DISCARDED = 'discarded';
  static STATUS_READY = 'ready';
  static STATUS_WAITING = 'waiting';

  /**
   * Indicates that this dialog cannot be processed.
   */
  get STATUS_BLOCKED() { return Dialog.STATUS_BLOCKED; }

  /**
   * Indicates that this dialog has been processed successfully.
   */
  get STATUS_COMPLETED() { return Dialog.STATUS_COMPLETED; }

  /**
   * Indicates that this dialog has been discarded by the user.
   */
  get STATUS_DISCARDED() { return Dialog.STATUS_DISCARDED; }

  /**
   * Indicates that this dialog is ready to be processed.
   */
  get STATUS_READY() { return Dialog.STATUS_READY; }

  /**
   * Indicates that this dialog is waiting for a user confirmation to be unblocked.
   */
  get STATUS_WAITING() { return Dialog.STATUS_WAITING; }

  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   * @param {number} [maxComplexity=Number.MAX_SAFE_INTEGER] - the optional dialog max complexity
   * @param {Object} [parameters={}] - the optional dialog parameters
   */
  constructor(config, brain, maxComplexity = Number.MAX_SAFE_INTEGER, parameters = {}) {
    logger.debug('constructor', parameters);
    this.brain = brain;
    this.parameters = parameters;
    this.maxComplexity = maxComplexity;
    this.viewManager = new ViewManager(config);
    this.name = this.getName();
  }

  /**
   * Gets dialog name
   * @returns {String} the dialog name
   */
  getName() {
    return this.constructor.name.toLowerCase().replace(/dialog/g, '');
  }

  /**
   * Displays messages by resolving the view associated to the dialog.
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {String} [key] - the dialog key is an optional parameter
   * used by the view to customize its behaviour
   * @param {Object} [data] - data used at display time
   * @returns {Promise.<void>}
   */
  async display(adapter, userId, key, data) {
    logger.debug('display', userId, key, data);
    const botMessages = this
          .viewManager
          .resolve(this.name)
          .renderAsJson(adapter.bot.id, userId, key, data);
    return adapter.send(botMessages);
  }

  /**
   * Executes the dialog.
   * @abstract
   * @async
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {String[]} messageEntities - the message entities
   * @returns {Promise.<void>}
   */
  async execute() {
    throw new MissingImplementationError();
  }
}

module.exports = Dialog;
