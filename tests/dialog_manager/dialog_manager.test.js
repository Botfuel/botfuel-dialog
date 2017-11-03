/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const Bot = require('../../src/bot');
const { BotTextMessage } = require('../../src/messages');

const TEST_USER = '1';

// require('../../src/logger_manager').configure({ logger: 'botfuel'});

describe('DialogManager', function () {
  const bot = new Bot({ path: __dirname, locale: 'en', adapter: 'test' });

  beforeEach(async function () {
    await bot.brain.clean();
    await bot.brain.initUserIfNecessary(TEST_USER);
  });

  it('when given a label, it should return the correct path', function () {
    expect(bot.dm.getDialogPath('test_dialog'))
      .to
      .eql(`${__dirname}/src/dialogs/test_dialog`);
  });

  it('when given an unknown label, it should return null', function () {
    expect(bot.dm.getDialogPath('unknown_dialog')).to.be(null);
  });

  it('should not crash when no intent', async function () {
    await bot.dm.execute(bot.adapter, TEST_USER, [], []);
    expect(bot.adapter.log).to.eql([
      new BotTextMessage('Not understood.').toJson(bot.id, TEST_USER),
    ]);
  });

  it('should keep on the stack a dialog which is waiting', async function () {
    await bot.dm.execute(null, TEST_USER, [{ label: 'waiting_dialog', value: 1.0 }], []);
    const user = await bot.dm.brain.getUser(TEST_USER);
    expect(user.dialogs.length).to.be(1);
  });

  it('should not stack the same dialog twice', async function () {
    await bot.dm.execute(null, TEST_USER, [{ label: 'waiting_dialog', value: 1.0 }], []);
    await bot.dm.execute(null, TEST_USER, [{ label: 'waiting_dialog', value: 1.0 }], []);
    const user = await bot.dm.brain.getUser(TEST_USER);
    expect(user.dialogs.length).to.be(1);
  });
});
