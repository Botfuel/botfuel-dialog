/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable prefer-arrow-callback */

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

  beforeEach(async () => {
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

  afterEach(async () => {
    await brain.clean();
  });

  afterAll(async function () {
    if (brainLabel === MONGO_BRAIN_LABEL) {
      await brain.dropDatabase();
    }
  });

  test('adds a user', async () => {
    await brain.addUser(USER_ID);
    const brainHasUser = await brain.hasUser(USER_ID);
    expect(brainHasUser).toBe(true);
  });

  test('gets a user', async () => {
    await brain.addUser(USER_ID);
    const user = await brain.getUser(USER_ID);
    expect(Object.keys(user)).toContain('botId', 'userId', 'conversations', 'dialogs', 'createdAt');
    expect(user.userId).toBe(USER_ID);
    expect(user.botId).toBe(BOT_ID);
    expect(user.conversations).toHaveLength(1);
    expect(user.dialogs.stack).toHaveLength(0);
  });

  test('sets user key', async () => {
    await brain.addUser(USER_ID);
    const user = await brain.userSet(USER_ID, 'name', 'test');
    expect(user).toHaveProperty('name');
    expect(user.name).toEqual('test');
  });

  test('gets user value', async () => {
    await brain.addUser(USER_ID);
    await brain.userSet(USER_ID, 'name', 'test');
    const name = await brain.userGet(USER_ID, 'name');
    expect(name).toEqual('test');
  });

  test('add conversation to user', async () => {
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    const user = await brain.getUser(USER_ID);
    expect(user.conversations).toHaveLength(2);
  });

  test('get last user conversation', async () => {
    await brain.addUser(USER_ID);
    const conversation = await brain.getLastConversation(USER_ID);
    expect(conversation).not.toBe(null);
  });

  test('set user last conversation key', async () => {
    await brain.addUser(USER_ID);
    const conversation = await brain.conversationSet(USER_ID, 'city', 'Paris');
    expect(conversation).toHaveProperty('city');
  });

  test('get user last conversation key', async () => {
    await brain.addUser(USER_ID);
    await brain.conversationSet(USER_ID, 'city', 'Paris');
    const city = await brain.conversationGet(USER_ID, 'city');
    expect(city).toEqual('Paris');
  });

  test(
    'get user last conversation values when many conversations',
    async () => {
      await brain.addUser(USER_ID);
      await brain.addConversation(USER_ID);
      await brain.addConversation(USER_ID);
      await brain.conversationSet(USER_ID, 'foo', 'bar');
      const value = await brain.conversationGet(USER_ID, 'foo');
      expect(value).toEqual('bar');
    },
  );

  test(
    'don\'t get user last conversation values from previous conversation',
    async () => {
      await brain.addUser(USER_ID);
      await brain.addConversation(USER_ID);
      await brain.conversationSet(USER_ID, 'previous', 'before');
      await brain.addConversation(USER_ID);
      await brain.conversationSet(USER_ID, 'current', 'now');
      const previous = await brain.conversationGet(USER_ID, 'previous');
      const current = await brain.conversationGet(USER_ID, 'current');
      expect(previous).toBe(undefined);
      expect(current).toEqual('now');
    },
  );

  test('clean the brain', async () => {
    await brain.addUser(USER_ID);
    await brain.clean();
    const brainHasUser = await brain.hasUser(USER_ID);
    expect(brainHasUser).toBe(false);
  });
};

describe('Brains', () => {
  describe('MongoBrain', () => { brainTest(MONGO_BRAIN_LABEL); });
  describe('MemoryBrain', () => { brainTest(MEMORY_BRAIN_LABEL); });
});
