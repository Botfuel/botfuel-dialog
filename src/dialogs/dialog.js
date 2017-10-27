const ViewsManager = require('../views_manager');

const logger = require('logtown').getLogger('Dialog');

/**
 * Generates messages.
 */
class Dialog {
  static STATUS_BLOCKED = 'blocked';
  static STATUS_COMPLETED = 'completed';
  static STATUS_DISCARDED = 'discarded';
  static STATUS_READY = 'ready';
  static STATUS_WAITING = 'waiting';

  /**
   * Constructor.
   * @param {Object} parameters the dialog parameters
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

  getName() {
    return this.constructor.name.toLowerCase().replace(/dialog/g, '');
  }

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
