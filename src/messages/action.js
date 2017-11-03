/**
 * Action message type
 */
class Action {
  /**
   * @constructor
   * @param {String} type - the action type
   * @param {String} text - the text
   * @param {Object|*} value - the value
   */
  constructor(type, text, value) {
    this.type = type;
    this.text = text;
    this.value = value;
  }

  toJson() {
    return {
      type: this.type,
      text: this.text,
      value: this.value,
    };
  }
}

module.exports = Action;
