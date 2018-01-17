const { PromptView, BotTextMessage } = require('botfuel-dialog');

class NameView extends PromptView {
  renderAsk() {
    return [
      new BotTextMessage('Do you still want me to ask your name?'),
    ];
  }

  renderConfirm() {
    return [
      new BotTextMessage('You still want me to ask your name.'),
    ];
  }

  renderDiscard() {
    return [
      new BotTextMessage('You don\'t want me to ask your name anymore.'),
    ];
  }
}

module.exports = NameView;
