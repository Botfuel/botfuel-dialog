/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const DialogManager = require('../../src/dialog_manager');
const MemoryBrain = require('../../src/brains/memory_brain');
const BotTextMessage = require('../../src/views/parts/bot_text_message');

const TEST_BOT = 1;
const TEST_USER = 1;

describe('DialogManager', function () {
  const brain = new MemoryBrain(TEST_BOT);
  const dm = new DialogManager(brain, { path: __dirname, locale: 'en', id: TEST_BOT });

  beforeEach(async function () {
    console.log('beforeEach');
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  it('when given a label, it should return the correct path', function () {
    expect(dm.getDialogPath('test_dialog'))
      .to
      .eql(`${__dirname}/src/controllers/dialogs/test_dialog`);
  });

  it('when given an unknown label, it should return null', function () {
    expect(dm.getDialogPath('unknown_dialog'))
      .to
      .be(null);
  });

  it('should not crash when no intent', async function () {
    const responses = await dm.execute(TEST_USER, [], []);
    expect(responses).to.eql([
      new BotTextMessage(TEST_BOT, TEST_USER, 'Not understood.').toJson(),
    ]);
  });

  it('should keep on the stack a dialog which is not done', async function () {
    await dm.execute(TEST_USER, [{ label: 'false_dialog', value: 1.0 }], []);
    const user = await dm.brain.getUser(TEST_USER);
    expect(user.dialogs.length).to.be(1);
  });

  it('should not stack the same dialog twice', async function () {
    await dm.execute(TEST_USER, [{ label: 'false_dialog', value: 1.0 }], []);
    await dm.execute(TEST_USER, [{ label: 'false_dialog', value: 1.0 }], []);
    const user = await dm.brain.getUser(TEST_USER);
    expect(user.dialogs.length).to.be(1);
  });
});
