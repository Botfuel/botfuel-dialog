const expect = require('expect.js');
const PromptDialog = require('../../src/dialogs/prompt_dialog');

describe('PromptDialog', () => {
  it('should work', async () => {
    const prompt = new PromptDialog({
      namespace: 'namespace',
      entities: {
        dim1: {},
        dim2: {},
      },
    });
    const id = 1;
    const brain = {
      conversationGet: function (id, namespace) {
        console.log('dm.brain.conversationGet', id, namespace);
      },
      conversationSet: function (id, namespace, obj) {
        console.log('dm.brain.conversationSet', id, namespace, obj);
      }
    };
    const dm = {
      say: function (id, label, obj) {
        console.log('dm.say', id, label, obj);
      },
      brain
    };

    const done = prompt.execute(dm, id, [
      {
        dim: 'dim1'
      }
    ]);
  });
});
