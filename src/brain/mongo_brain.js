import _ from 'lodash';
import * as db from './db';
import { User, Conversation } from './models';

/**
 * Class to wrap mongodb database with two models
 */
export default class MongoBrain {
  /**
   * Constructor
   * @param {string} botId - bot id
   */
  constructor(botId) {
    // connect to mongodb if not connected yet
    if (!db.isConnected()) {
      db.connect();
    }
    this.botId = botId;
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  addUser(userId) {
    return User.create({ botId: this.botId, userId });
  }

  /**
   * Get an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  getUser(userId) {
    return User.findOne({ botId: this.botId, userId });
  }

  /**
   * Update an user
   * @param {string} userId - user id
   * @param {Object} updates - user updates
   * @returns {Promise}
   */
  updateUser(userId, updates) {
    return User.findOneAndUpdate({ botId: this.botId, userId }, updates);
  }

  /**
   * Remove an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  removeUser(userId) {
    return User.remove({ botId: this.botId, userId });
  }

  /**
   * Add a conversation to an user
   * @param {string} userId - user id
   * @param {object} data - conversation data object
   * @returns {Promise}
   */
  addConversation(userId, data) {
    return new Promise((resolve, reject) => {
      User.findOne({ botId: this.botId, userId })
        .then((user) => {
          const conversation = new Conversation({ user, data });
          conversation.save()
            .then((savedConversation) => {
              user.conversations.push(savedConversation);
              user.save()
                .then(() => {
                  resolve(savedConversation);
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Get a conversation
   * @param {ObjectId} conversationId - conversation id
   * @returns {Promise}
   */
  getConversation(conversationId) {
    return Conversation.findOne({ _id: conversationId });
  }

  /**
   * Get user conversations
   * @param {ObjectId} userId - user mongodb id
   * @returns {Promise}
   */
  getConversations(userId) {
    return Conversation.find({ user: userId });
  }

  /**
   * Get user last conversation
   * @param {ObjectId} userId - user id
   * @returns {Promise}
   */
  getLastConversation(userId) {
    return Conversation.findOne({ user: userId }).sort('-createdAt').exec();
  }

  /**
   * Update a conversation
   * @param {ObjectId} conversationId - conversation id
   * @param {object} data - conversation data object
   * @returns {Promise}
   */
  updateConversation(conversationId, data) {
    return new Promise((resolve, reject) => {
      Conversation.findOne({ _id: conversationId }, 'data')
        .then((conversation) => {
          const newData = _.extend(conversation.data, data);
          Conversation.findOneAndUpdate(
            { _id: conversationId },
            { $set: { data: newData } },
            { new: true },
          )
            .then(updatedConversation => resolve(updatedConversation))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Remove a conversation
   * @param {string} userId - user id
   * @param {ObjectId} conversationId - conversation id
   * @returns {Promise}
   */
  removeConversation(userId, conversationId) {
    return new Promise((resolve, reject) => {
      Conversation.remove({ _id: conversationId })
        .then(() => {
          User.findOneAndUpdate(
            { botId: this.botId, userId },
            { $pull: { conversations: conversationId } },
            { new: true },
          )
            .then(user => resolve(user))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Set a key in user scope
   * @param {string} userId - user id
   * @param {string} key - user key
   * @param {*} value - value to set
   * @returns {Promise}
   */
  set(userId, key, value) {
    const set = {};
    set[key] = value;
    return User.findOneAndUpdate({ botId: this.botId, userId }, { $set: set }, { new: true });
  }

  /**
   * Get a key in user scope
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  get(userId, key) {
    return new Promise((resolve, reject) => {
      User.findOne({ botId: this.botId, userId }, key)
        .then((user) => {
          if (user[key]) {
            resolve(user[key]);
          } else {
            reject(new Error(`Key not found in user ${userId}`));
          }
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Push to an array key in user scope
   * @param {string} userId - user id
   * @param {string} key - user key
   * @param {*} value - value to push
   * @returns {Promise}
   */
  push(userId, key, value) {
    const push = {};
    push[key] = value;
    return User.findOneAndUpdate({ botId: this.botId, userId }, { $push: push }, { new: true });
  }

  /**
   * Pop from an array key in user scope - (last element)
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  pop(userId, key) {
    const pop = {};
    pop[key] = 1; // mongo $pop { array: 1 } pop the last element of an array
    return User.findOneAndUpdate({ botId: this.botId, userId }, { $pop: pop }, { new: true });
  }

  /**
   * Shift from an array key in user scope - (first element)
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  shift(userId, key) {
    const pop = {};
    pop[key] = -1; // mongo $pop { array: -1 } pop the first element of an array
    return User.findOneAndUpdate({ botId: this.botId, userId }, { $pop: pop }, { new: true });
  }
}
