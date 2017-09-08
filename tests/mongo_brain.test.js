const MongoBrain = require('../src/brain/mongo/mongo_brain');

const BOT_ID = '1';

test('add an user', async () => {
  expect.assertions(1);
  const brain = new MongoBrain(BOT_ID);
  const user = await brain.addUser('1');
  expect(user.userId).toBe('1');
});

test('get an user', async () => {
  expect.assertions(1);
  const brain = new MongoBrain(BOT_ID);
  const user = await brain.getUser('1');
  expect(user.userId).toBe('1');
});

test('set user key', async () => {
  expect.assertions(1);
  const brain = new MongoBrain(BOT_ID);
  await brain.userSet('1', 'name', 'test');
  const user = await brain.getUser('1');
  expect(user.name).toBe('test');
});

test('get user key', async () => {
  expect.assertions(1);
  const brain = new MongoBrain(BOT_ID);
  const name = await brain.userGet('1', 'name');
  expect(name).toBe('test');
});

test('push to user key array', async () => {
  expect.assertions(2);
  const brain = new MongoBrain(BOT_ID);
  const dialog = { label: 'travel', entities: { city: 'Paris' } };
  const user = await brain.userPush('1', 'dialogs', dialog);
  expect(user.dialogs).toHaveLength(1);
  expect(user.dialogs[0].label).toEqual('travel');
});

test('add conversation to user', async () => {
  expect.assertions(1);
  const brain = new MongoBrain(BOT_ID);
  await brain.addConversation('1');
  const user = await brain.getUser('1');
  expect(user.conversations).toHaveLength(1);
});

test('get last user conversation', async () => {
  expect.assertions(1);
  const brain = new MongoBrain(BOT_ID);
  await brain.addConversation('1');
  const conversation = await brain.getLastConversation('1');
  expect(conversation).toBeDefined();
});

test('set user last conversation key', async () => {
  expect.assertions(1);
  const brain = new MongoBrain(BOT_ID);
  await brain.addConversation('1');
  const conversation = await brain.conversationSet('1', 'city', 'Paris');
  expect(conversation).toHaveProperty('city', 'Paris');
});

test('get user last conversation key', async () => {
  expect.assertions(1);
  const brain = new MongoBrain(BOT_ID);
  const city = await brain.conversationGet('1', 'city');
  expect(city).toBe('Paris');
});
