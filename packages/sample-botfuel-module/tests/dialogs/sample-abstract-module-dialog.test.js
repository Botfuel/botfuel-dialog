// See https://github.com/Botfuel/botfuel-dialog/tree/master/packages/botfuel-dialog/tests/dialogs

const { Bot } = require('botfuel-dialog');
const SampleAbstractModuleDialog = require('../../src/dialogs/sample-abstract-module-dialog');

const TEST_CONFIG = {
  brain: {
    name: 'memory',
    conversationDuration: 86400000, // one day in ms
  },
  componentRoots: [],
  locale: 'en',
  path: __dirname,
};


describe('SampleAbstractModuleDialog', () => {
  const bot = new Bot(TEST_CONFIG);

  test('should be buildable', async () => {
    const dialog = new SampleAbstractModuleDialog(bot);

    expect(dialog.secretSauce).toEqual(42);
  });
});
