const expect = require('expect.js');
const PromptDialog = require('../../src/dialogs/prompt_dialog');
const MemoryBrain = require('../../src/brains/memory/memory_brain');

const TEST_USER = 1;

describe('PromptDialog', function() {
  const prompt = new PromptDialog({
    namespace: 'testdialog',
    entities: {
      dim1: {},
      dim2: {},
    },
  });

  it('when given no entity, should ask for both', async function() {
    const brain = new MemoryBrain();
    await brain.initUserIfNecessary(TEST_USER);
    const log = [];
    const dm = {
      say: (id, label, parameters) => log.push({label, parameters}),
      brain,
    };
    await prompt.execute(dm, TEST_USER, []);
    const user = await brain.getUser(TEST_USER);
    expect(log).to.eql([
      {
        "label": "entity_ask",
        "parameters": {
          "entity": "dim1",
        },
      },
      {
        "label": "entity_ask",
        "parameters": {
          "entity": "dim2",
        },
      },
    ]);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1).to.be(undefined);
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given a first entity, should ask for the second one', async function() {
    const brain = new MemoryBrain();
    await brain.initUserIfNecessary(TEST_USER);
    const log = [];
    const dm = {
      say: (id, label, parameters) => log.push({label, parameters}),
      brain,
    };
    await prompt.execute(dm, TEST_USER, [ { dim: 'dim1' } ]);
    const user = await brain.getUser(TEST_USER);
    expect(log).to.eql([
      {
        "label": "entity_confirm",
        "parameters": {
          "entity": {
            "dim": "dim1",
          },
        },
      },
      {
        "label": "entity_ask",
        "parameters": {
          "entity": "dim2",
        },
      },
    ]);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given both entity, should ask none', async function() {
    const brain = new MemoryBrain();
    await brain.initUserIfNecessary(TEST_USER);
    const log = [];
    const dm = {
      say: (id, label, parameters) => log.push({label, parameters}),
      brain,
    };
    await prompt.execute(dm, TEST_USER, [ { dim: 'dim1' },  { dim: 'dim2' } ]);
    const user = await brain.getUser(TEST_USER);
    expect(log).to.eql([
      {
        "label": "entity_confirm",
        "parameters": {
          "entity": {
            "dim": "dim1",
          },
        },
      },
      {
        "label": "entity_confirm",
        "parameters": {
          "entity": {
            "dim": "dim2",
          },
        },
      },
    ]);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2.dim).to.be('dim2');
  });
});
