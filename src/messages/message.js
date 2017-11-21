/**
 * An abstract message.
 */
class Message {
  /**
   * @constructor
   * @param {String} type - the message type
   * @param {String} sender - the message sender, the bot or the user
   * @param {*} value - the message value
   * @param {Object} [options] - the message options
   */
  constructor(type, sender, value, options) {
    this.type = type;
    this.sender = sender;
    this.value = value;
    this.options = options;
  }

  /**
   * Converts a message to json and adds to it the bot and user ids.
   * @param {String} botId - the bot id
   * @param {String} userId - the user id
   * @returns {Object} the json message
   */
  toJson(botId, userId) {
    if (this.options === undefined || this.options === null) {
      return {
        type: this.type,
        sender: this.sender,
        bot: botId,
        user: userId,
        payload: {
          value: this.valueAsJson(),
        },
      };
    }
    return {
      type: this.type,
      sender: this.sender,
      bot: botId,
      user: userId,
      payload: {
        value: this.valueAsJson(),
        options: this.options,
      },
    };
  }

  /**
   * Returns the value as json
   * @returns {*} the json value
   */
  valueAsJson() {
    return this.value;
  }
}

module.exports = Message;
