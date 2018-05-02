// See https://github.com/Botfuel/botfuel-dialog/tree/master/packages/botfuel-dialog/tests/brains

const SampleModuleBrain = require('../../src/brains/sample-module-brain');

describe('SampleModuleBrain', () => {
  test('should read config', async () => {
    const brain = new SampleModuleBrain({
      brain: {
        brainSecretSauce: 42,
      },
    });
    expect(brain.secretSauce).toBe(42);
  });
});
