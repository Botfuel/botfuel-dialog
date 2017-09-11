const MemoryBrain = require('../src/brains/memory/memory_brain');

const BOT_ID = '1';
const USER1_ID = '1';

test('that a user has been added', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser(USER1_ID);
  expect(brain.hasUser(USER1_ID)).resolves.toBe(true);
});

test('gets a user', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser(USER1_ID);
  const user = await brain.getUser(USER1_ID);
  expect(user.userId).toBe(USER1_ID);
});

test('sets user key', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser(USER1_ID);
  const user = await brain.userSet(USER1_ID, 'name', 'test');
  expect(user.name).toBe('test');
});

test('gets user value', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser(USER1_ID);
  await brain.userSet(USER1_ID, 'name', 'test');
  const name = await brain.userGet(USER1_ID, 'name');
  expect(name).toBe('test');
});

test('push to user key array', async () => {
  expect.assertions(2);
  const brain = new MemoryBrain(BOT_ID);
  const dialog = { label: 'travel', entities: { city: 'Paris' } };
  await brain.addUser(USER1_ID);
  const user = await brain.userPush(USER1_ID, 'dialogs', dialog);
  expect(user.dialogs).toHaveLength(1);
  expect(user.dialogs[0]).toEqual(dialog);
});

test('add conversation to user', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser(USER1_ID);
  await brain.addConversation(USER1_ID);
  const user = await brain.getUser(USER1_ID);
  expect(user.conversations).toHaveLength(1);
});

test('get last user conversation', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser(USER1_ID);
  await brain.addConversation(USER1_ID);
  const conversation = await brain.getLastConversation(USER1_ID);
  expect(conversation).toBeDefined();
});

test('set user last conversation key', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser(USER1_ID);
  await brain.addConversation(USER1_ID);
  const conversation = await brain.conversationSet(USER1_ID, 'city', 'Paris');
  expect(conversation).toHaveProperty('city', 'Paris');
});

test('get user last conversation key', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser(USER1_ID);
  await brain.addConversation(USER1_ID);
  await brain.conversationSet(USER1_ID, 'city', 'Paris');
  const city = await brain.conversationGet(USER1_ID, 'city');
  expect(city).toBe('Paris');
});
