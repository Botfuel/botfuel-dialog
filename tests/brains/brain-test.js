/* eslint-disable prefer-arrow-callback */

const expect = require('expect.js');
const MemoryBrain = require('../../src/brains/memory-brain');
const MongoBrain = require('../../src/brains/mongo-brain');

// db label
const MEMORY_BRAIN_LABEL = 'memory';
const MONGO_BRAIN_LABEL = 'mongo';

// bot + user ids
const BOT_ID = 'BOT_TEST';
const USER_ID = 'USER_TEST';

const brainTest = (brainLabel) => {
  let brain;

  beforeEach(async function () {
    switch (brainLabel) {
      case MONGO_BRAIN_LABEL:
        brain = new MongoBrain(BOT_ID);
        await brain.init();
        break;
      case MEMORY_BRAIN_LABEL:
      default:
        brain = new MemoryBrain(BOT_ID);
    }
  });

  afterEach(async function () {
    await brain.clean();
  });

  after('Drop database if MongoBrain', async function () {
    if (brainLabel === MONGO_BRAIN_LABEL) {
      await brain.dropDatabase();
    }
  });

  it('adds a user', async function () {
    await brain.addUser(USER_ID);
    const brainHasUser = await brain.hasUser(USER_ID);
    expect(brainHasUser).to.be(true);
  });

  it('gets a user', async function () {
    await brain.addUser(USER_ID);
    const user = await brain.getUser(USER_ID);
    expect(user).to.include.keys('botId', 'userId', 'conversations', 'dialogs', 'createdAt');
    expect(user.userId).to.be(USER_ID);
    expect(user.botId).to.be(BOT_ID);
    expect(user.conversations).to.empty();
    expect(user.dialogs.stack).to.empty();
  });

  it('sets user key', async function () {
    await brain.addUser(USER_ID);
    const user = await brain.userSet(USER_ID, 'name', 'test');
    expect(user).to.have.property('name');
    expect(user.name).to.be('test');
  });

  it('gets user value', async function () {
    await brain.addUser(USER_ID);
    await brain.userSet(USER_ID, 'name', 'test');
    const name = await brain.userGet(USER_ID, 'name');
    expect(name).to.be('test');
  });

  it('add conversation to user', async function () {
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    const user = await brain.getUser(USER_ID);
    expect(user.conversations).to.have.length(1);
  });

  it('get last user conversation', async function () {
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    const conversation = await brain.getLastConversation(USER_ID);
    expect(conversation).not.to.be(null);
  });

  it('set user last conversation key', async function () {
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    const conversation = await brain.conversationSet(USER_ID, 'city', 'Paris');
    expect(conversation).to.have.property('city', 'Paris');
  });

  it('get user last conversation key', async function () {
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    await brain.conversationSet(USER_ID, 'city', 'Paris');
    const city = await brain.conversationGet(USER_ID, 'city');
    expect(city).to.be('Paris');
  });

  it('clean the brain', async function () {
    await brain.addUser(USER_ID);
    await brain.clean();
    const brainHasUser = await brain.hasUser(USER_ID);
    expect(brainHasUser).to.be(false);
  });
};

module.exports = brainTest;
