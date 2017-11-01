/**
 * Action message type
 */
class Action {
  /**
   * @constructor
   * @param {string} type - the action type
   * @param {string} text - the text
   * @param {object|*} value - the value
   */
  constructor(type, text, value) {
    this.type = type;
    this.text = text;
    this.value = value;
  }

  /**
   * Convert the action to json
   * @return {object} the json action
   */
  toJson() {
    return {
      type: this.type,
      text: this.text,
      value: this.value,
    };
  }
}

module.exports = Action;
