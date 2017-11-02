const logger = require('logtown')('Dialog');
const ViewsManager = require('../views_manager');

/**
 * Dialog generates messages.
 */
class Dialog {
  /**
   * Dialog blocked status
   * @static
   * @type {String}
   */
  static STATUS_BLOCKED = 'blocked';

  /**
   * Dialog completed status
   * @static
   * @type {String}
   */
  static STATUS_COMPLETED = 'completed';

  /**
   * Dialog discarded status
   * @static
   * @type {String}
   */
  static STATUS_DISCARDED = 'discarded';

  /**
   * Dialog ready status
   * @static
   * @type {String}
   */
  static STATUS_READY = 'ready';

  /**
   * Dialog ready status
   * @static
   * @type {String}
   */
  static STATUS_WAITING = 'waiting';

  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   * @param {number} [maxComplexity=Number.MAX_SAFE_INTEGER] - the dialog max complexity
   * @param {Object} [parameters={}] - the dialog parameters
   */
  constructor(config, brain, maxComplexity = Number.MAX_SAFE_INTEGER, parameters = {}) {
    logger.debug('constructor', parameters);
    this.brain = brain;
    this.parameters = parameters;
    this.maxComplexity = maxComplexity;
    this.viewsManager = new ViewsManager(config);
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
   * @param {Object} [parameters] - the dialog parameters
   * @returns {void}
   */
  display(adapter, userId, key, parameters) {
    logger.debug('display', userId, key, parameters);
    const botMessages = this
          .viewsManager
          .resolve(this.name)
          .render(key, parameters)
          .map((message) => {
            message.bot = adapter.bot.id;
            message.user = userId;
            return message.toJson();
          });
    adapter.send(botMessages);
  }
}

module.exports = Dialog;
