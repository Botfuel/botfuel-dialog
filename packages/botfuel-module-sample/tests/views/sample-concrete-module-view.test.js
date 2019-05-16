// See https://github.com/Botfuel/botfuel-dialog/tree/master/packages/botfuel-dialog/tests/views

const { BotTextMessage } = require('botfuel-dialog');
const SampleConcreteModuleView = require('../../src/views/sample-concrete-module-view');

describe('SampleConcreteModuleView', () => {
  test('should product correct responses', async () => {
    const view = new SampleConcreteModuleView();
    const botResponses = view.render({}, { specialData: 46 });
    expect(botResponses).toEqual([
      new BotTextMessage('Hello human!'),
      new BotTextMessage('Special data: 46'),
    ]);
  });
});
