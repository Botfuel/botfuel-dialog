const { View, BotTextMessage } = require('botfuel-dialog');

class SampleConcreteModuleView extends View {
  render(userMessage, { specialData }) {
    const botResponses = [new BotTextMessage('Hello human!')];
    botResponses.push(new BotTextMessage(`Special data: ${specialData}`));
    return botResponses;
  }
}

module.exports = SampleConcreteModuleView;
