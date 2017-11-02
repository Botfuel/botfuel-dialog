const Message = require('./message');

/**
 * Postback message
 * @extends Message
 */
class PostbackMessage extends Message {
  /**
   * @constructor
   * @param {String} dialog - the postback dialog name
   * @param {Object[]} entities - the dialog entities
   */
  constructor(dialog, entities) {
    super('postback', 'user', { dialog, entities });
  }
}

module.exports = PostbackMessage;
