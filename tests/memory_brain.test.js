import { MemoryBrain } from '../src/brain';

const BOT_ID = '1';

test('that a user has been added', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser('1');
  expect(brain.hasUser('1')).resolves.toBe(true);
});

test('gets a user', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser('1');
  const user = await brain.getUser('1');
  expect(user.userId).toBe('1');
});

test('sets user key', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser('1');
  const user = await brain.userSet('1', 'name', 'test');
  expect(user.name).toBe('test');
});

test('gets user value', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser('1');
  await brain.userSet('1', 'name', 'test');
  const name = await brain.userGet('1', 'name');
  expect(name).toBe('test');
});

test('push to user key array', async () => {
  expect.assertions(2);
  const brain = new MemoryBrain(BOT_ID);
  const dialog = { label: 'travel', entities: { city: 'Paris' } };
  await brain.addUser('1');
  const user = await brain.userPush('1', 'dialogs', dialog);
  expect(user.dialogs).toHaveLength(1);
  expect(user.dialogs[0]).toEqual(dialog);
});

test('add conversation to user', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser('1');
  await brain.addConversation('1');
  const user = await brain.getUser('1');
  expect(user.conversations).toHaveLength(1);
});

test('get last user conversation', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser('1');
  await brain.addConversation('1');
  const conversation = await brain.getLastConversation('1');
  expect(conversation).toBeDefined();
});

test('set user last conversation key', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser('1');
  await brain.addConversation('1');
  const conversation = await brain.conversationSet('1', 'city', 'Paris');
  expect(conversation).toHaveProperty('city', 'Paris');
});

test('get user last conversation key', async () => {
  expect.assertions(1);
  const brain = new MemoryBrain(BOT_ID);
  await brain.addUser('1');
  await brain.addConversation('1');
  await brain.conversationSet('1', 'city', 'Paris');
  const city = await brain.conversationGet('1', 'city');
  expect(city).toBe('Paris');
});
