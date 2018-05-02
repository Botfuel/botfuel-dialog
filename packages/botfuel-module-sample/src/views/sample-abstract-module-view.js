const { View, MissingImplementationError, BotTextMessage } = require('botfuel-dialog');

class SampleAbstractModuleView extends View {
  /**
   * Give the actual bot responses
   */
  getTextsConcrete() {
    throw new MissingImplementationError();
  }

  render(userMessage, { specialData }) {
    const botResponses = this.getTextsConcrete(userMessage).map(msg => new BotTextMessage(msg));
    botResponses.push(new BotTextMessage(`Special data: ${specialData}`));
    return botResponses;
  }
}

module.exports = SampleAbstractModuleView;
