/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const PromptDialog = require('../../src/dialogs/prompt_dialog');
const MemoryBrain = require('../../src/brains/memory_brain');
const { BotTextMessage } = require('../../src/messages');

const TEST_USER = '1';
const TEST_BOT = '1';

describe('PromptDialog', function () {
  const brain = new MemoryBrain(TEST_BOT);
  const prompt = new PromptDialog(
    { path: __dirname, locale: 'en', id: TEST_BOT },
    brain,
    { namespace: 'testdialog', entities: { dim1: null, dim2: null } },
  );

  beforeEach(async function () {
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  it('when given no entity, should list both and ask for one', async function () {
    const responses = [];
    await prompt.execute(TEST_USER, responses, []);
    expect(responses).to.eql([
      new BotTextMessage(TEST_BOT, TEST_USER, 'Entities needed: dim1, dim2').toJson(),
      new BotTextMessage(TEST_BOT, TEST_USER, 'Which dim1?').toJson(),
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1).to.be(undefined);
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given a first entity, should list both and ask for the second one', async function () {
    const responses = [];
    await prompt.execute(TEST_USER, responses, [{ dim: 'dim1', body: 'dim1' }]);
    expect(responses).to.eql([
      new BotTextMessage(TEST_BOT, TEST_USER, 'Entities defined: dim1').toJson(),
      new BotTextMessage(TEST_BOT, TEST_USER, 'Entities needed: dim2').toJson(),
      new BotTextMessage(TEST_BOT, TEST_USER, 'Which dim2?').toJson(),
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given both entity, should ask none', async function () {
    const responses = [];
    await prompt.execute(TEST_USER, responses, [{ dim: 'dim1', body: 'dim1' }, { dim: 'dim2', body: 'dim2' }], PromptDialog.STATUS_READY);
    expect(responses).to.eql([
      new BotTextMessage(TEST_BOT, TEST_USER, 'Entities defined: dim1, dim2').toJson(),
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2.dim).to.be('dim2');
  });
});
