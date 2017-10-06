/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const PromptDialog = require('../../src/dialogs/prompt_dialog');
const MemoryBrain = require('../../src/brains/memory_brain');

const TEST_USER = 1;

class TestPromptDialog extends PromptDialog {
  constructor(brain, parameters) {
    super({}, brain, parameters);
  }

  textMessage(id, responses, label, parameters) {
    responses.push({
      id,
      label,
      parameters,
    });
  }
}

describe('PromptDialog', function () {
  const brain = new MemoryBrain();
  const prompt = new TestPromptDialog(brain, {
    namespace: 'testdialog',
    entities: { dim1: null, dim2: null },
  });

  beforeEach(async function () {
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  it('when given no entity, should ask for both', async function () {
    const responses = [];
    await prompt.execute(TEST_USER, responses, []);
    expect(responses).to.eql([
      {
        id: TEST_USER,
        label: 'testdialog_dim1_ask',
        parameters: { entity: 'dim1' },
      },
      {
        id: TEST_USER,
        label: 'testdialog_dim2_ask',
        parameters: { entity: 'dim2' },
      },
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1).to.be(undefined);
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given a first entity, should ask for the second one', async function () {
    const responses = [];
    await prompt.execute(TEST_USER, responses, [{ dim: 'dim1' }]);
    expect(responses).to.eql([
      {
        id: TEST_USER,
        label: 'testdialog_dim1_confirm',
        parameters: { entity: { dim: 'dim1' } },
      },
      {
        id: TEST_USER,
        label: 'testdialog_dim2_ask',
        parameters: { entity: 'dim2' },
      },
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given both entity, should ask none', async function () {
    const responses = [];
    await prompt.execute(TEST_USER, responses, [{ dim: 'dim1' }, { dim: 'dim2' }]);
    expect(responses).to.eql([
      {
        id: TEST_USER,
        label: 'testdialog_dim1_confirm',
        parameters: { entity: { dim: 'dim1' } },
      },
      {
        id: TEST_USER,
        label: 'testdialog_dim2_confirm',
        parameters: { entity: { dim: 'dim2' } },
      },
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2.dim).to.be('dim2');
  });
});
