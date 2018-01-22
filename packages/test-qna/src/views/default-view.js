const { BotTextMessage, TextView } = require('botfuel-dialog');

class DefaultView extends TextView {
  render() {
    return [
      new BotTextMessage('I’m sorry, I did not understand your question. Please reach us at contact@my-sample-compagny.com for further assistance.'),
    ];
  }
}

module.exports = DefaultView;
