// See https://github.com/Botfuel/botfuel-dialog/tree/master/packages/botfuel-dialog/tests/views

const SampleAbstractModuleView = require('../../src/views/sample-abstract-module-view');
const { BotTextMessage } = require('botfuel-dialog');

class TestView extends SampleAbstractModuleView {
  getTextsConcrete() {
    return ['Hi!'];
  }
}

describe('SampleAbstractModuleView', () => {
  test('should product correct responses', async () => {
    const view = new TestView();
    const botResponses = view.render({}, { specialData: 45 });
    expect(botResponses).toEqual([
      new BotTextMessage('Hi!'),
      new BotTextMessage('Special data: 45'),
    ]);
  });
});
