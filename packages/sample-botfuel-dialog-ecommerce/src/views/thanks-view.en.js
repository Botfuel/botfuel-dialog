const { TextView } = require('botfuel-dialog');

class ThanksView extends TextView {
  getTexts() {
    return ['You\'re welcome!'];
  }
}

module.exports = ThanksView;
