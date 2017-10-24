/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const ViewsManager = require('../../src/views_manager');
const PromptDialog = require('../../src/dialogs/prompt_dialog');
const MemoryBrain = require('../../src/brains/memory_brain');

const TEST_USER = '1';
const TEST_BOT = '1';
const testConfig = { path: __dirname, locale: 'en', id: TEST_BOT };
const testParameters = { namespace: 'testdialog', entities: { dim1: null, dim2: null } };

class TestViewsManager extends ViewsManager {
  resolve(id, name, keys, parameters) {
    return [{
      id,
      name,
      keys,
      parameters,
    }];
  }
}

class TestPromptDialog extends PromptDialog {
  constructor(config, brain, parameters) {
    super(config, brain, parameters);
    this.viewsManager = new TestViewsManager(config);
  }
}

describe('PromptDialog', function () {
  const brain = new MemoryBrain(TEST_BOT);
  const prompt = new TestPromptDialog(testConfig, brain, testParameters);

  beforeEach(async function () {
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  it('when given no entity, should ask for both', async function () {
    const responses = [];
    await prompt.execute(TEST_USER, responses, [], PromptDialog.STATUS_READY);
    expect(responses).to.eql([
      {
        id: TEST_USER,
        name: 'testprompt',
        keys: ['entities_ask'],
        parameters: { entities: ['dim1', 'dim2'] },
      },
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1).to.be(undefined);
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given a first entity, should ask for the second one', async function () {
    const responses = [];
    await prompt.execute(TEST_USER, responses, [{ dim: 'dim1' }], PromptDialog.STATUS_READY);
    expect(responses).to.eql([
      {
        id: TEST_USER,
        name: 'testprompt',
        keys: ['dim1_confirm', 'entity_confirm'],
        parameters: { entity: { dim: 'dim1' } },
      },
      {
        id: TEST_USER,
        name: 'testprompt',
        keys: ['dim2_ask', 'entity_ask'],
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
    await prompt.execute(TEST_USER, responses, [{ dim: 'dim1' }, { dim: 'dim2' }], PromptDialog.STATUS_READY);
    expect(responses).to.eql([
      {
        id: TEST_USER,
        name: 'testprompt',
        keys: ['dim1_confirm', 'entity_confirm'],
        parameters: { entity: { dim: 'dim1' } },
      },
      {
        id: TEST_USER,
        name: 'testprompt',
        keys: ['dim2_confirm', 'entity_confirm'],
        parameters: { entity: { dim: 'dim2' } },
      },
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2.dim).to.be('dim2');
  });
});
