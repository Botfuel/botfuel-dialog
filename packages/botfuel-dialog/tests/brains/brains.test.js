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

const sinon = require('sinon');
const Brain = require('../../src/brains/brain');
const MemoryBrain = require('../../src/brains/memory-brain');
const MongoBrain = require('../../src/brains/mongo-brain');
const MissingCredentialsError = require('../../src/errors/missing-credentials-error');

// db label
const MEMORY_BRAIN_LABEL = 'memory';
const MONGO_BRAIN_LABEL = 'mongo';

const USER_ID = 'USER_TEST';

const BRAIN_CONFIG = {
  brain: {
    conversationDuration: 86400000, // one day in ms
  },
};

const brainTest = (brainLabel) => {
  let sandbox;
  let brain;

  beforeAll(() => {
    if (brainLabel === MONGO_BRAIN_LABEL) {
      sandbox = sinon.sandbox.create();
    }
  });

  beforeEach(async () => {
    switch (brainLabel) {
      case MONGO_BRAIN_LABEL:
        brain = new MongoBrain(BRAIN_CONFIG);
        await brain.init();
        break;
      case MEMORY_BRAIN_LABEL:
      default:
        brain = new MemoryBrain(BRAIN_CONFIG);
    }
  });

  afterEach(async () => {
    await brain.clean();
  });

  afterAll(async () => {
    if (brainLabel === MONGO_BRAIN_LABEL) {
      await brain.dropDatabase();
      sandbox.restore();
    }
  });

  test('adds a user', async () => {
    await brain.addUser(USER_ID);
    const brainHasUser = await brain.hasUser(USER_ID);
    expect(brainHasUser).toBe(true);
  });

  test('adds a user if not exists', async () => {
    await brain.addUserIfNecessary(USER_ID);
    const brainHasUser = await brain.hasUser(USER_ID);
    expect(brainHasUser).toBe(true);
  });

  test('gets a user', async () => {
    await brain.addUser(USER_ID);
    const user = await brain.getUser(USER_ID);
    expect(Object.keys(user)).toContain('userId', 'conversations', 'dialogs', 'createdAt');
    expect(user.userId).toBe(USER_ID);
    expect(user.conversations).toHaveLength(1);
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
    const { _dialogs } = conversation;
    expect(conversation).not.toBe(null);
    expect(_dialogs.stack).toHaveLength(0);
  });

  test('get last user conversation when no conversation', async () => {
    await brain.addUser(USER_ID);
    await brain.userSet(USER_ID, 'conversations', []);
    const conversation = await brain.getLastConversation(USER_ID);
    const { _dialogs } = conversation;
    expect(conversation).not.toBe(null);
    expect(_dialogs.stack).toHaveLength(0);
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

  test('get user last conversation values when many conversations', async () => {
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    await brain.addConversation(USER_ID);
    await brain.conversationSet(USER_ID, 'foo', 'bar');
    const value = await brain.conversationGet(USER_ID, 'foo');
    expect(value).toEqual('bar');
  });

  test("don't get user last conversation values from previous conversation", async () => {
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    await brain.conversationSet(USER_ID, 'previous', 'before');
    await brain.addConversation(USER_ID);
    await brain.conversationSet(USER_ID, 'current', 'now');
    const previous = await brain.conversationGet(USER_ID, 'previous');
    const current = await brain.conversationGet(USER_ID, 'current');
    expect(previous).toBe(undefined);
    expect(current).toEqual('now');
  });

  test('clean the brain', async () => {
    await brain.addUser(USER_ID);
    await brain.clean();
    const brainHasUser = await brain.hasUser(USER_ID);
    expect(brainHasUser).toBe(false);
  });

  test('get last conversation dialogs', async () => {
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    const dialogs = await brain.getDialogs(USER_ID);
    expect(dialogs.stack).toHaveLength(0);
    expect(dialogs.previous).toHaveLength(0);
  });

  test('set last conversation dialogs', async () => {
    const dialogsData = {
      stack: [{ name: 'greetings', entities: [] }],
      previous: [],
    };
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    await brain.setDialogs(USER_ID, dialogsData);
    const dialogs = await brain.getDialogs(USER_ID);
    expect(dialogs.stack).toHaveLength(1);
    expect(dialogs.stack[0].name).toBe('greetings');
    expect(dialogs.previous).toHaveLength(0);
  });

  test('start a new conversation', async () => {
    const dialogsData = {
      isNewConversation: true,
      stack: [{ name: 'greetings', entities: [] }],
      previous: [],
    };
    await brain.addUser(USER_ID);
    await brain.addConversation(USER_ID);
    await brain.setDialogs(USER_ID, dialogsData);
    const dialogs = await brain.getDialogs(USER_ID);
    const conversations = await brain.userGet(USER_ID, 'conversations');
    expect(conversations.length).toEqual(3);
    expect(dialogs.stack).toHaveLength(1);
    expect(dialogs.stack[0].name).toBe('greetings');
    expect(dialogs.previous).toHaveLength(0);
  });

  test('should set and get value', async () => {
    await brain.botSet('test', 'hello');
    const value = await brain.botGet('test');
    expect(value).toEqual('hello');
  });

  test('should throw an error when adding a user that already exists', async () => {
    try {
      await brain.addUser(USER_ID);
      await brain.addUser(USER_ID);
    } catch (e) {
      expect(e.message).toEqual('An user with this id for this bot already exists');
    }
  });

  test('should throw an error when getting a non existing user', async () => {
    try {
      await brain.getUser(USER_ID);
    } catch (e) {
      expect(e.message).toEqual('User does not exist');
    }
  });

  if (brainLabel === MONGO_BRAIN_LABEL) {
    test('should return the env var mongodb uri provided', () => {
      sandbox.stub(process, 'env').value({ MONGODB_URI: 'mongodb://localhost/test' });
      expect(brain.getMongoDbUri()).toEqual('mongodb://localhost/test');
    });

    test('should throw an error when no botfuel app token provided', () => {
      sandbox.stub(process, 'env').value({ BOTFUEL_APP_TOKEN: undefined });
      expect(() => brain.getMongoDbUri()).toThrow(MissingCredentialsError);
    });
  }
};

describe('Brains', () => {
  describe('MongoBrain', () => {
    brainTest(MONGO_BRAIN_LABEL);
  });
  describe('MemoryBrain', () => {
    brainTest(MEMORY_BRAIN_LABEL);
  });
  describe('Brain', () => {
    describe('Should throw missing implementation error for methods', () => {
      test('botSet', async () => {
        try {
          await new Brain(BRAIN_CONFIG).botSet();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('botGet', async () => {
        try {
          await new Brain(BRAIN_CONFIG).botGet();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('conversationSet', async () => {
        try {
          await new Brain(BRAIN_CONFIG).conversationSet();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('userSet', async () => {
        try {
          await new Brain(BRAIN_CONFIG).userSet();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('getUser', async () => {
        try {
          await new Brain(BRAIN_CONFIG).getUser();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('addConversation', async () => {
        try {
          await new Brain(BRAIN_CONFIG).addConversation();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('getLastConversation', async () => {
        try {
          await new Brain(BRAIN_CONFIG).getLastConversation();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('addUser', async () => {
        try {
          await new Brain(BRAIN_CONFIG).addUser();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('hasUser', async () => {
        try {
          await new Brain(BRAIN_CONFIG).hasUser();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });

      test('clean', async () => {
        try {
          await new Brain(BRAIN_CONFIG).clean();
        } catch (e) {
          expect(e.message).toEqual('Not implemented!');
        }
      });
    });

    describe('Should no throw error for methods', () => {
      test('init', async () => {
        expect(async () => new Brain(BRAIN_CONFIG).init()).not.toThrow();
      });
    });
  });
});
