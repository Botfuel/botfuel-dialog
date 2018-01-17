const { TextView } = require('botfuel-dialog');

class ResetView extends TextView {
  getTexts() {
    return ['A new conversation has started!'];
  }
}

module.exports = ResetView;
