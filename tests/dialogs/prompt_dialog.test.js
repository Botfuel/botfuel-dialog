/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const Bot = require('../../src/bot');
const PromptDialog = require('../../src/dialogs/prompt_dialog');
const { BotTextMessage } = require('../../src/messages');

const TEST_USER = '1';

// require('../../src/logger_manager').configure({ logger: 'botfuel'});

describe('PromptDialog', function () {
  const bot = new Bot({ path: __dirname, locale: 'en', adapter: 'test' });
  const prompt = new PromptDialog(
    { path: __dirname, locale: 'en' },
    bot.brain,
    { namespace: 'testdialog', entities: { dim1: null, dim2: null } },
  );

  beforeEach(async function () {
    await bot.brain.clean();
    await bot.brain.initUserIfNecessary(TEST_USER);
  });

  afterEach(function () {
    bot.adapter.log = [];
  });

  it('when given no entity, should list both and ask for one', async function () {
    await prompt.execute(
      bot.adapter,
      TEST_USER,
      [],
    );
    expect(bot.adapter.log).to.eql([
      new BotTextMessage('Entities needed: dim1, dim2').toJson(),
      new BotTextMessage('Which dim1?').toJson(),
    ]);
    const user = await bot.brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1).to.be(undefined);
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given a first entity, should list both and ask for the second one', async function () {
    await prompt.execute(
      bot.adapter,
      TEST_USER,
      [{ dim: 'dim1', body: 'dim1' }],
    );
    expect(bot.adapter.log).to.eql([
      new BotTextMessage('Entities defined: dim1').toJson(),
      new BotTextMessage('Entities needed: dim2').toJson(),
      new BotTextMessage('Which dim2?').toJson(),
    ]);
    const user = await bot.brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given both entity, should ask none', async function () {
    await prompt.execute(
      bot.adapter,
      TEST_USER,
      [{ dim: 'dim1', body: 'dim1' }, { dim: 'dim2', body: 'dim2' }],
      PromptDialog.STATUS_READY,
    );
    expect(bot.adapter.log).to.eql([
      new BotTextMessage('Entities defined: dim1, dim2').toJson(),
    ]);
    const user = await bot.brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2.dim).to.be('dim2');
  });
});
