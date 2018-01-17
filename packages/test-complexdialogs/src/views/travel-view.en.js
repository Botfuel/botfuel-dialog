const { PromptView, BotTextMessage } = require('botfuel-dialog');

class TravelView extends PromptView {
  renderAsk() {
    return [
      new BotTextMessage('Do you still want to travel?'),
    ];
  }

  renderConfirm() {
    return [
      new BotTextMessage('You still want to travel.'),
    ];
  }

  renderDiscard() {
    return [
      new BotTextMessage('You don\'t want to travel anymore.'),
    ];
  }
}

module.exports = TravelView;
