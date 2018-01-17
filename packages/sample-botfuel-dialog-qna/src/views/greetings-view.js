const { TextView } = require('botfuel-dialog');

class GreetingsView extends TextView {
  getTexts() {
    return ['Hello human!'];
  }
}

module.exports = GreetingsView;
