const expect = require('expect.js');
const MemoryBrain = require('../../src/brains/memory/memory_brain');
const MongoBrain = require('../../src/brains/mongo/mongo_brain');
const db = require('../../src/brains/mongo/db');

// db label
const MEMORY_BRAIN_LABEL = 'memory';
const MONGO_BRAIN_LABEL = 'mongo';

// mongo db uri
const MONGODB_URI = 'mongodb://localhost/sdk-brain-test';

// bot + user ids
const BOT_TEST_ID = 'BOT_TEST';
const USER_TEST_ID = 'USER_TEST';

const brainTest = (brainLabel) => {
  let brain;

  beforeEach(() => {
    switch (brainLabel) {
      case MONGO_BRAIN_LABEL:
        brain = new MongoBrain(BOT_TEST_ID, MONGODB_URI);
        break;
      case MEMORY_BRAIN_LABEL:
      default:
        brain = new MemoryBrain(BOT_TEST_ID);
    }
  });

  afterEach((done) => {
    brain.clean().then(() => done());
  });

  after('Drop database if MongoBrain', (done) => {
    if (brainLabel === MONGO_BRAIN_LABEL) {
      db.dropDatabase().then(() => done());
    } else {
      done();
    }
  });

  it('that a user has been added', async () => {
    await brain.addUser(USER_TEST_ID);
    const brainHasUser = await brain.hasUser(USER_TEST_ID);
    expect(brainHasUser).to.be(true);
  });

  it('gets an user', async () => {
    await brain.addUser(USER_TEST_ID);
    const user = await brain.getUser(USER_TEST_ID);
    expect(user.userId).to.be(USER_TEST_ID);
  });

  it('sets user key', async () => {
    await brain.addUser(USER_TEST_ID);
    const user = await brain.userSet(USER_TEST_ID, 'name', 'test');
    expect(user.name).to.be('test');
  });

  it('gets user value', async () => {
    await brain.addUser(USER_TEST_ID);
    await brain.userSet(USER_TEST_ID, 'name', 'test');
    const name = await brain.userGet(USER_TEST_ID, 'name');
    expect(name).to.be('test');
  });

  it('push to user key array', async () => {
    const dialog = { label: 'travel', entities: { city: 'Paris' } };
    await brain.addUser(USER_TEST_ID);
    const user = await brain.userPush(USER_TEST_ID, 'dialogs', dialog);
    expect(user.dialogs).to.have.length(1);
    expect(user.dialogs[0].label).to.be(dialog.label);
  });

  it('add conversation to user', async () => {
    await brain.addUser(USER_TEST_ID);
    await brain.addConversation(USER_TEST_ID);
    const user = await brain.getUser(USER_TEST_ID);
    expect(user.conversations).to.have.length(1);
  });

  it('get last user conversation', async () => {
    await brain.addUser(USER_TEST_ID);
    await brain.addConversation(USER_TEST_ID);
    const conversation = await brain.getLastConversation(USER_TEST_ID);
    expect(conversation).not.to.be(null);
  });

  it('set user last conversation key', async () => {
    await brain.addUser(USER_TEST_ID);
    await brain.addConversation(USER_TEST_ID);
    const conversation = await brain.conversationSet(USER_TEST_ID, 'city', 'Paris');
    expect(conversation).to.have.property('city', 'Paris');
  });

  it('get user last conversation key', async () => {
    await brain.addUser(USER_TEST_ID);
    await brain.addConversation(USER_TEST_ID);
    await brain.conversationSet(USER_TEST_ID, 'city', 'Paris');
    const city = await brain.conversationGet(USER_TEST_ID, 'city');
    expect(city).to.be('Paris');
  });

  it('clean the brain', async () => {
    await brain.addUser(USER_TEST_ID);
    await brain.clean();
    const brainHasUser = await brain.hasUser(USER_TEST_ID);
    expect(brainHasUser).to.be(false);
  });
};

module.exports = brainTest;
