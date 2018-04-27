const SampleModuleNlu = require('../../src/nlus/sample-module-nlu');

describe('SampleModuleNlu', () => {
  test('should read config', async () => {
    const nlu = new SampleModuleNlu({
      nlu: {
        nluSecretSauce: 42,
        intentThreshold: 0.8,
      },
    });
    expect(nlu.secretSauce).toBe(42);
  });
});
