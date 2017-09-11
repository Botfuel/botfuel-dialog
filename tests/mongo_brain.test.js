const expect = require('expect.js');
const MongoBrain = require('../src/brains/mongo/mongo_brain');
const User = require('../src/brains/mongo/models/user');

const BOT_ID = '1';
const USER_TEST_ID = 'TEST_USER';

describe('MongoBrain', () => {
  after('clean user TEST', async () => {
    await User.remove({ userId: USER_TEST_ID });
  });

  it('test that an user has been added', async () => {
    const brain = new MongoBrain(BOT_ID);
    await brain.addUser(USER_TEST_ID);
    const brainHasUser = await brain.hasUser(USER_TEST_ID);
    expect(brainHasUser).to.be(true);
  });

  it('gets an user', async () => {
    const brain = new MongoBrain(BOT_ID);
    const user = await brain.getUser(USER_TEST_ID);
    expect(user.userId).to.be(USER_TEST_ID);
  });

  it('sets user key', async () => {
    const brain = new MongoBrain(BOT_ID);
    const user = await brain.userSet(USER_TEST_ID, 'name', 'test');
    expect(user.name).to.be('test');
  });

  it('gets user value', async () => {
    const brain = new MongoBrain(BOT_ID);
    const name = await brain.userGet(USER_TEST_ID, 'name');
    expect(name).to.be('test');
  });

  it('push to user key array', async () => {
    const brain = new MongoBrain(BOT_ID);
    const dialog = { label: 'travel', entities: { city: 'Paris' } };
    const user = await brain.userPush(USER_TEST_ID, 'dialogs', dialog);
    expect(user.dialogs).to.have.length(1);
    expect(user.dialogs[0].label).to.be('travel');
  });

  it('add conversation to user', async () => {
    const brain = new MongoBrain(BOT_ID);
    await brain.addConversation(USER_TEST_ID);
    const user = await brain.getUser(USER_TEST_ID);
    expect(user.conversations).to.have.length(1);
  });

  it('get last user conversation', async () => {
    const brain = new MongoBrain(BOT_ID);
    await brain.addConversation(USER_TEST_ID);
    const conversation = await brain.getLastConversation(USER_TEST_ID);
    expect(conversation).not.to.be(null);
  });

  it('set user last conversation key', async () => {
    const brain = new MongoBrain(BOT_ID);
    await brain.addConversation(USER_TEST_ID);
    const conversation = await brain.conversationSet(USER_TEST_ID, 'city', 'Paris');
    expect(conversation).to.have.property('city', 'Paris');
  });

  it('get user last conversation key', async () => {
    const brain = new MongoBrain(BOT_ID);
    const city = await brain.conversationGet(USER_TEST_ID, 'city');
    expect(city).to.be('Paris');
  });
});
