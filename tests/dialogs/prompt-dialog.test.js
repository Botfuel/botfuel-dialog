/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const PromptDialog = require('../../src/dialogs/prompt-dialog');
const MemoryBrain = require('../../src/brains/memory-brain');
const TestAdapter = require('../../src/adapters/test-adapter');
const { BotTextMessage } = require('../../src/messages');

const TEST_USER = '1';
const TEST_BOT = process.env.BOT_ID;

// require('../../src/logger_manager').configure({ logger: 'botfuel'});

describe('PromptDialog', function () {
  const brain = new MemoryBrain(TEST_BOT);
  const prompt = new PromptDialog(
    { path: __dirname, locale: 'en' },
    brain,
    { namespace: 'testdialog', entities: { dim1: null, dim2: null } },
  );

  beforeEach(async function () {
    await brain.clean();
    await brain.initUserIfNecessary(TEST_USER);
  });

  it('when given no entity, should list both and ask for one', async function () {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await prompt.execute(
      adapter,
      TEST_USER,
      [],
    );
    expect(adapter.log).to.eql([
      new BotTextMessage('Entities needed: dim1, dim2').toJson(TEST_BOT, TEST_USER),
      new BotTextMessage('Which dim1?').toJson(TEST_BOT, TEST_USER),
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1).to.be(undefined);
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given a first entity, should list both and ask for the second one', async function () {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await prompt.execute(
      adapter,
      TEST_USER,
      [{ dim: 'dim1', body: 'dim1' }],
    );
    expect(adapter.log).to.eql([
      new BotTextMessage('Entities defined: dim1').toJson(TEST_BOT, TEST_USER),
      new BotTextMessage('Entities needed: dim2').toJson(TEST_BOT, TEST_USER),
      new BotTextMessage('Which dim2?').toJson(TEST_BOT, TEST_USER),
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given both entity, should ask none', async function () {
    const adapter = new TestAdapter({ id: TEST_BOT }, {});
    await prompt.execute(
      adapter,
      TEST_USER,
      [{ dim: 'dim1', body: 'dim1' }, { dim: 'dim2', body: 'dim2' }],
      PromptDialog.STATUS_READY,
    );
    expect(adapter.log).to.eql([
      new BotTextMessage('Entities defined: dim1, dim2').toJson(TEST_BOT, TEST_USER),
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2.dim).to.be('dim2');
  });
});
