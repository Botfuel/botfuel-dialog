// See https://github.com/Botfuel/botfuel-dialog/tree/master/packages/botfuel-dialog/tests/dialogs

const { Bot } = require('botfuel-dialog');
const SampleConcreteModuleDialog = require('../../src/dialogs/sample-concrete-module-dialog');

const TEST_CONFIG = {
  brain: {
    name: 'memory',
    conversationDuration: 86400000, // one day in ms
  },
  componentRoots: [],
  locale: 'en',
  path: __dirname,
};


describe('SampleConcreteModuleDialog', () => {
  const bot = new Bot(TEST_CONFIG);

  test('should produce correct data', async () => {
    const dialog = new SampleConcreteModuleDialog(
      bot,
      {
        namespace: 'testdialog',
        entities: {},
      },
    );

    const dialogData = await dialog.dialogWillDisplay();

    expect(dialogData).toEqual({ specialData: 42 });
  });
});
