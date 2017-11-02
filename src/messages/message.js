/**
 * Message
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
   * Converts a message to json
   * @returns {Object} the json message
   */
  toJson(bot, user) {
    if (this.options === undefined || this.options === null) {
      return {
        type: this.type,
        sender: this.sender,
        bot,
        user,
        payload: {
          value: this.valueAsJson(),
        },
      };
    }
    return {
      type: this.type,
      sender: this.sender,
      bot,
      user,
      payload: {
        value: this.valueAsJson(),
        options: this.options,
      },
    };
  }

  valueAsJson() {
    return this.value;
  }
}

module.exports = Message;
