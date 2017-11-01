/**
 * Action
 * @class
 * @classdesc action message type
 * @param {string} type - the action type
 * @param {string} text - the text
 * @param {object|*} - the value
 */
class Action {
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
