const logger = require('logtown')('Dialog');
const ViewsManager = require('../views_manager');

/**
 * Dialog generates messages.
 */
class Dialog {
  /**
   * Dialog blocked status
   * @static
   */
  static STATUS_BLOCKED = 'blocked';

  /**
   * Dialog completed status
   * @static
   */
  static STATUS_COMPLETED = 'completed';

  /**
   * Dialog discarded status
   * @static
   */
  static STATUS_DISCARDED = 'discarded';

  /**
   * Dialog ready status
   * @static
   */
  static STATUS_READY = 'ready';

  /**
   * Dialog ready status
   * @static
   */
  static STATUS_WAITING = 'waiting';

  /**
   * @constructor
   * @param {object} config - the bot config
   * @param {class} brain - the bot brain
   * @param {number} [maxComplexity=Number.MAX_SAFE_INTEGER] - the dialog max complexity
   * @param {object} [parameters={}] - the dialog parameters
   */
  constructor(config, brain, maxComplexity = Number.MAX_SAFE_INTEGER, parameters = {}) {
    logger.debug('constructor', parameters);
    this.config = config;
    this.brain = brain;
    this.parameters = parameters;
    this.maxComplexity = maxComplexity;
    this.viewsManager = new ViewsManager(config);
    this.name = this.getName();
  }

  /**
   * Get dialog name
   * @return {string} the dialog name
   */
  getName() {
    return this.constructor.name.toLowerCase().replace(/dialog/g, '');
  }

  /**
   * Display a message to user
   * @param {string} userId - the user id
   * @param {object[]} responses - the bot responses
   * @param {string} key - the dialog key
   * @param {object} [parameters] - the dialog parameters
   */
  display(userId, responses, key, parameters) {
    logger.debug('display', userId, responses, key, parameters);
    const botMessages = this
          .viewsManager
          .resolve(this.name)
          .render(this.config.id, userId, key, parameters);
    logger.debug('display: botMessages', botMessages);
    for (const botMessage of botMessages) {
      responses.push(botMessage.toJson());
    }
  }
}

module.exports = Dialog;
