/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const DialogManager = require('../../src/dialog_manager');
const MemoryBrain = require('../../src/brains/memory_brain');
const TestAdapter = require('../../src/adapters/test_adapter');
const { BotTextMessage } = require('../../src/messages');

const TEST_USER = '1';
const TEST_BOT = process.env.BOT_ID;

// require('../../src/logger_manager').configure({ logger: 'botfuel' });

describe('DialogManager', function () {
  const brain = new MemoryBrain(TEST_BOT);
  const dm = new DialogManager(brain, { path: __dirname, locale: 'en' });

  beforeEach(async function () {
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  it('when given a label, it should return the correct path', function () {
    expect(dm.getDialogPath('test_dialog'))
      .to
      .eql(`${__dirname}/src/dialogs/test_dialog`);
  });

  it('when given an unknown label, it should return null', function () {
    expect(dm.getDialogPath('unknown_dialog')).to.be(null);
  });

  it('should not crash when no intent', async function () {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await dm.execute(adapter, TEST_USER, [], []);
    expect(adapter.log).to.eql([
      new BotTextMessage('Not understood.').toJson(TEST_BOT, TEST_USER),
    ]);
  });

  it('should keep on the stack a dialog which is waiting', async function () {
    await dm.execute(null, TEST_USER, [{ label: 'waiting_dialog', value: 1.0 }], []);
    const user = await dm.brain.getUser(TEST_USER);
    expect(user.dialogs.stack.length).to.be(1);
  });

  it('should not stack the same dialog twice', async function () {
    await dm.execute(null, TEST_USER, [{ label: 'waiting_dialog', value: 1.0 }], []);
    await dm.execute(null, TEST_USER, [{ label: 'waiting_dialog', value: 1.0 }], []);
    const user = await dm.brain.getUser(TEST_USER);
    expect(user.dialogs.stack.length).to.be(1);
  });
});
