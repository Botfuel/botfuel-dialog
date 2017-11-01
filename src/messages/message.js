/**
 * Message
 */
class Message {
  /**
   * @constructor
   * @param {String} type - the message type
   * @param {String} sender - the message sender, the bot or the user
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @param {*} value - the message value
   * @param {Object} [options] - the message options
   */
  constructor(type, sender, botId, userId, value, options) {
    this.type = type;
    this.sender = sender;
    this.bot = botId;
    this.user = userId;
    this.value = value;
    this.options = options;
  }

  /**
   * Convert a message to json
   * @returns {Object} the json message
   */
  toJson() {
    if (this.options !== undefined) {
      return {
        type: this.type,
        sender: this.sender,
        bot: this.bot,
        user: this.user,
        payload: {
          value: this.value,
          options: this.options,
        },
      };
    }
    return {
      type: this.type,
      sender: this.sender,
      bot: this.bot,
      user: this.user,
      payload: {
        value: this.value,
      },
    };
  }
}

module.exports = Message;
