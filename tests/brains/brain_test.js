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
const BOT_ID = 'BOT_TEST';
const USER_ID = 'USER_TEST';

const brainTest = (brainLabel) => {
  let brain;

  beforeEach(function () {
    switch (brainLabel) {
      case MONGO_BRAIN_LABEL:
        brain = new MongoBrain(BOT_ID, MONGODB_URI);
        break;
      case MEMORY_BRAIN_LABEL:
      default:
        brain = new MemoryBrain(BOT_ID);
    }
  });

  afterEach(function (done) {
    brain.clean().then(() => done());
  });

  after('Drop database if MongoBrain', function (done) {
    if (brainLabel === MONGO_BRAIN_LABEL) {
      db.dropDatabase().then(() => done());
    } else {
      done();
    }
  });

  it('that a user has been added', async function () {
    await brain.addUser(USER_ID);
    const brainHasUser = await brain.hasUser(USER_ID);
    expect(brainHasUser).to.be(true);
  });

  it('gets an user', async function () {
    await brain.addUser(USER_ID);
    const user = await brain.getUser(USER_ID);
    expect(user).to.include.keys('botId', 'userId', 'conversations', 'dialogs', 'createdAt');
    expect(user.userId).to.be(USER_ID);
    expect(user.botId).to.be(BOT_ID);
    expect(user.conversations).to.empty();
    expect(user.dialogs).to.empty();
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

  it('push to user key array', async function () {
    const dialog = { label: 'travel', parameters: { city: 'Paris' } };
    await brain.addUser(USER_ID);
    const user = await brain.userPush(USER_ID, 'dialogs', dialog);
    expect(user.dialogs).to.have.length(1);
    expect(user.dialogs[0].label).to.be(dialog.label);
    expect(user.dialogs[0].parameters.city).to.be(dialog.parameters.city);
  });

  it('shift from user key array', async function () {
    const dialogOne = { label: 'travel', entities: { city: 'Paris' } };
    const dialogTwo = { label: 'greetings' };
    await brain.addUser(USER_ID);
    await brain.userPush(USER_ID, 'dialogs', dialogOne);
    await brain.userPush(USER_ID, 'dialogs', dialogTwo);
    const dialog = await brain.userShift(USER_ID, 'dialogs');
    expect(dialog.label).to.be('travel');
  });

  it('pop from user key array', async function () {
    const dialogOne = { label: 'travel', entities: { city: 'Paris' } };
    const dialogTwo = { label: 'greetings' };
    await brain.addUser(USER_ID);
    await brain.userPush(USER_ID, 'dialogs', dialogOne);
    await brain.userPush(USER_ID, 'dialogs', dialogTwo);
    const dialog = await brain.userPop(USER_ID, 'dialogs');
    expect(dialog.label).to.be('greetings');
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
