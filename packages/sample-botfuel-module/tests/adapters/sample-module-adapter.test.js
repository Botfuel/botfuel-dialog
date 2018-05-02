// See https://github.com/Botfuel/botfuel-dialog/tree/master/packages/botfuel-dialog/tests/adapters

const SampleModuleAdapter = require('../../src/adapters/sample-module-adapter');

describe('SampleModuleAdapter', () => {
  test('should read config', async () => {
    const adapter = new SampleModuleAdapter({
      config: {
        adapter: {
          adapterSecretSauce: 42,
        },
      },
    });
    expect(adapter.secretSauce).toBe(42);
  });
});
