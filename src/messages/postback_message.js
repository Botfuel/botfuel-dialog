const Message = require('./message');

/**
 * Postback message
 * @extends Message
 */
class PostbackMessage extends Message {
  /**
   * @constructor
   * @param {String} userId - the user id
   * @param {String} dialog - the postback dialog name
   * @param {Object[]} entities - the dialog entities
   * @param {Object} [options] - the message options
   */
  constructor(userId, dialog, entities, options) {
    super('postback', 'user', userId, { dialog, entities }, options);
  }
}

module.exports = PostbackMessage;
