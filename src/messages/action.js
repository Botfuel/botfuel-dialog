class Action {
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
