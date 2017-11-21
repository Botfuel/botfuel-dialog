const Part = require('./part');

/**
 * An action is a message part abstracting links and buttons.
 */
class Action extends Part {
  /**
   * @constructor
   * @param {String} type - the action type
   * @param {String} text - the text
   * @param {Object|*} value - the value
   */
  constructor(type, text, value) {
    super();
    this.type = type;
    this.text = text;
    this.value = value;
  }

  // eslint-disable-next-line require-jsdoc
  toJson() {
    return {
      type: this.type,
      text: this.text,
      value: this.value,
    };
  }
}

module.exports = Action;
