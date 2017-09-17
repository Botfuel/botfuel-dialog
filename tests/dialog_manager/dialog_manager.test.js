const expect = require('expect.js');
const DialogManager = require('../../src/dialog_manager');
const MemoryBrain = require('../../src/brains/memory/memory_brain');

const TEST_BOT = 1;
const TEST_USER = 1;

describe('DialogManager', function() {
  const brain = new MemoryBrain(TEST_BOT);
  const dm = new DialogManager(brain, { path: __dirname });

  beforeEach(async function() {
    console.log('beforeEach');
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  it('when given a label, it should return the correct path', function() {
    expect(dm.getPath('test_dialog'))
      .to
      .eql(`${ __dirname }/src/controllers/dialogs/test_dialog`);
  });

  it('when given an unknown label, it should return the default path', function() {
    expect(dm.getPath('unknown_dialog'))
      .to
      .eql('./dialogs/unknown_dialog');
  });

  it('should not crash when no intent', async function() {
    const responses = await dm.execute(TEST_USER, [], []);
    expect(responses).to.eql([]);
  });
});
