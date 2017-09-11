const expect = require('expect.js');
const MemoryBrain = require('../src/brains/memory/memory_brain');

const BOT_ID = '1';
const USER1_ID = '1';

describe('MemoryBrain', function() {
  it('that a user has been added', async function() {
    const brain = new MemoryBrain(BOT_ID);
    await brain.addUser(USER1_ID);
    const brainHasUser = await brain.hasUser(USER1_ID);
    expect(brainHasUser).to.be(true);
  });

  it('gets an user', async function() {
    const brain = new MemoryBrain(BOT_ID);
    await brain.addUser(USER1_ID);
    const user = await brain.getUser(USER1_ID);
    expect(user.userId).to.be(USER1_ID);
  });

  it('sets user key', async function() {
    const brain = new MemoryBrain(BOT_ID);
    await brain.addUser(USER1_ID);
    const user = await brain.userSet(USER1_ID, 'name', 'test');
    expect(user.name).to.be('test');
  });

  it('gets user value', async function() {
    const brain = new MemoryBrain(BOT_ID);
    await brain.addUser(USER1_ID);
    await brain.userSet(USER1_ID, 'name', 'test');
    const name = await brain.userGet(USER1_ID, 'name');
    expect(name).to.be('test');
  });

  it('push to user key array', async function() {
    const brain = new MemoryBrain(BOT_ID);
    const dialog = { label: 'travel', entities: { city: 'Paris' } };
    await brain.addUser(USER1_ID);
    const user = await brain.userPush(USER1_ID, 'dialogs', dialog);
    expect(user.dialogs).to.have.length(1);
    expect(user.dialogs[0]).to.be(dialog);
  });

  it('add conversation to user', async function() {
    const brain = new MemoryBrain(BOT_ID);
    await brain.addUser(USER1_ID);
    await brain.addConversation(USER1_ID);
    const user = await brain.getUser(USER1_ID);
    expect(user.conversations).to.have.length(1);
  });

  it('get last user conversation', async function() {
    const brain = new MemoryBrain(BOT_ID);
    await brain.addUser(USER1_ID);
    await brain.addConversation(USER1_ID);
    const conversation = await brain.getLastConversation(USER1_ID);
    expect(conversation).not.to.be(null);
  });

  it('set user last conversation key', async function() {
    const brain = new MemoryBrain(BOT_ID);
    await brain.addUser(USER1_ID);
    await brain.addConversation(USER1_ID);
    const conversation = await brain.conversationSet(USER1_ID, 'city', 'Paris');
    expect(conversation).to.have.property('city', 'Paris');
  });

  it('get user last conversation key', async function() {
    const brain = new MemoryBrain(BOT_ID);
    await brain.addUser(USER1_ID);
    await brain.addConversation(USER1_ID);
    await brain.conversationSet(USER1_ID, 'city', 'Paris');
    const city = await brain.conversationGet(USER1_ID, 'city');
    expect(city).to.be('Paris');
  });
});
