const logger = require('logtown')('Dialog');
const ViewManager = require('../view_manager');

/**
 * Dialog generates messages.
 */
class Dialog {
  static STATUS_BLOCKED = 'blocked';
  static STATUS_COMPLETED = 'completed';
  static STATUS_DISCARDED = 'discarded';
  static STATUS_READY = 'ready';
  static STATUS_WAITING = 'waiting';

  get STATUS_BLOCKED() { return Dialog.STATUS_BLOCKED; }
  get STATUS_COMPLETED() { return Dialog.STATUS_COMPLETED; }
  get STATUS_DISCARDED() { return Dialog.STATUS_DISCARDED; }
  get STATUS_READY() { return Dialog.STATUS_READY; }
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
   * Displays a message to user
   * @param {Adapter} adapter - the adapter
   * @param {String} userId - the user id
   * @param {String} key - the dialog key
   * @param {Object} [parameters] - the optional dialog parameters
   * @returns {void}
   */
  async display(adapter, userId, key, parameters) {
    logger.debug('display', userId, key, parameters);
    const botMessages = this
          .viewManager
          .resolve(this.name)
          .renderAsJson(adapter.bot.id, userId, key, parameters);
    await adapter.send(botMessages);
  }
}

module.exports = Dialog;
