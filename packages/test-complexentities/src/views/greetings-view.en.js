const { TextView } = require('botfuel-dialog');

class GreetingsView extends TextView {
  getTexts(data) {
    if (data.greeted) {
      return ['Hello again human!'];
    }
    return ['Hello human!'];
  }
}

module.exports = GreetingsView;
