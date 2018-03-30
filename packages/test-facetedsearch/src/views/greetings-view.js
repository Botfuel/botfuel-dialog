const { TextView } = require('botfuel-dialog');

class GreetingsView extends TextView {
  getTexts(userMessage, { extraData }) {
    if (extraData.greeted) {
      return ['Rebonjour!'];
    }
    return ['Bonjour!'];
  }
}

module.exports = GreetingsView;
