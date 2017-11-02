const logger = require('logtown')('PromptDialog');
const Dialog = require('./dialog');

/**
 * The prompt dialog is used to ask some things to the user
 * @extends Dialog
 */
class PromptDialog extends Dialog {
  /**
   * @constructor
   * @param {Object} config - the bot config
   * @param {class} brain - the bot brain
   * @param {Object} parameters - the dialog status
   */
  constructor(config, brain, parameters) {
    super(config, brain, Object.keys(parameters.entities).length + 1, parameters);
  }

  /**
   * Compute the dialog missing entities
   * @async
   * @param {String} userId - the user id
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<string[]>}
   */
  async computeMissingEntities(userId, messageEntities) {
    logger.debug('computeMissingEntities', messageEntities);
    const { namespace, entities } = this.parameters;
    const dialogEntities = await this.brain.conversationGet(userId, namespace) || {};
    for (const messageEntity of messageEntities) {
      dialogEntities[messageEntity.dim] = messageEntity;
    }
    logger.debug('computeMissingEntities: dialogEntities', dialogEntities);
    await this.brain.conversationSet(userId, namespace, dialogEntities);
    return Object.keys(entities).filter(entityKey => dialogEntities[entityKey] === undefined);
  }

  /**
   * Execute dialog when blocked status
   * @async
   * @param {String} userId - the user id
   * @param {Object[]} responses - the responses to display
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<string>} the next dialog's status
   */
  async executeWhenBlocked(userId, responses, messageEntities) {
    logger.debug('executeWhenBlocked', userId, responses, messageEntities);
    this.display(userId, responses, 'ask');
    return Dialog.STATUS_WAITING;
  }

  /**
   * Execute dialog when waiting status
   * @async
   * @param {String} userId - the user id
   * @param {Object[]} responses - the responses to display
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<string>} the next dialog's status
   */
  async executeWhenWaiting(userId, responses, messageEntities) {
    logger.debug('executeWhenWaiting');
    for (const messageEntity of messageEntities) {
      if (messageEntity.dim === 'system:boolean') {
        const booleanValue = messageEntity.values[0].value;
        logger.debug('execute: system:boolean', booleanValue);
        if (booleanValue) {
          this.display(userId, responses, 'confirm');
          return this.executeWhenReady(userId, responses, messageEntities);
        }
        // if not confirmed, then discard dialog
        this.display(userId, responses, 'discard');
        return Dialog.STATUS_DISCARDED;
      }
    }
    return Dialog.STATUS_BLOCKED;
  }

  /**
   * Execute dialog when ready status
   * @async
   * @param {String} userId - the user id
   * @param {Object[]} responses - the responses to display
   * @param {Object[]} messageEntities - the message entities
   * @returns {Promise.<string>} the next dialog's status
   */
  async executeWhenReady(userId, responses, messageEntities) {
    logger.debug('executeWhenReady', messageEntities, this.parameters.entities);
    // confirm entities
    messageEntities = messageEntities
      .filter(entity => this.parameters.entities[entity.dim] !== undefined);
    const missingEntities = await this.computeMissingEntities(userId, messageEntities);
    this.display(userId, responses, 'entities', { messageEntities, missingEntities });
    return missingEntities.length === 0 ? Dialog.STATUS_COMPLETED : Dialog.STATUS_READY;
  }

  /**
   * Executes dialog according to it's status.
   * @param {String} userId the user id
   * @param {Object[]} responses - the responses to display
   * @param {Object[]} messageEntities - entities array from user message
   * @param {String} status - the dialog status
   * @returns {function} the execute method according to the dialog status
   */
  async execute(userId, responses, messageEntities, status) {
    logger.debug('execute', userId, responses, messageEntities, status);
    switch (status) {
      case Dialog.STATUS_BLOCKED:
        return this.executeWhenBlocked(userId, responses, messageEntities);
      case Dialog.STATUS_WAITING:
        return this.executeWhenWaiting(userId, responses, messageEntities);
      case Dialog.STATUS_READY:
      default:
        return this.executeWhenReady(userId, responses, messageEntities);
    }
  }
}

module.exports = PromptDialog;
