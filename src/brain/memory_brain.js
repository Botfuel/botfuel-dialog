import _ from 'lodash';

/**
 * Class to wrap memory brain
 */
export default class MemoryBrain {
  /**
   * Constructor
   * @param {string} botId - bot id
   */
  constructor(botId) {
    this.botId = botId;
    this.users = [];
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Query|*} - promise
   */
  addUser(userId) {
    return new Promise((resolve, reject) => {
      if (_.findIndex(this.users, { botId: this.botId, userId }) === -1) {
        const newUser = { botId: this.botId, userId, conversations: [], createdAt: Date.now() };
        this.users.push(newUser);
        resolve(newUser);
      } else {
        reject('An user with this id for this bot already exist');
      }
    });
  }

  /**
   * Get an user
   * @param {string} userId - user id
   * @returns {Query|*} - promise
   */
  getUser(userId) {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.users, { botId: this.botId, userId });
      if (index !== -1) {
        resolve(this.users[index]);
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Update an user
   * @param {string} userId - user id
   * @param {Object} updates - user updates
   * @returns {Query|*} - promise
   */
  updateUser(userId, updates) {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.users, { botId: this.botId, userId });
      if (index !== -1) {
        this.users[index] = _.extend(this.users[index], updates);
        resolve(this.users[index]);
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Remove an user
   * @param {string} userId - user id
   * @returns {Query|*} - promise
   */
  removeUser(userId) {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.users, { botId: this.botId, userId });
      if (index !== -1) {
        this.users = _.pullAt(this.users, index);
        resolve(`User ${userId} has been removed`);
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Add a conversation to an user
   * @param {string} userId - user id
   * @param {object} data - conversation data object
   * @returns {Query|*} - promise
   */
  addConversation(userId, data) {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.users, { botId: this.botId, userId });
      if (index !== -1) {
        const conversation = {
          id: this.users[index].conversations.length,
          data,
          createdAt: Date.now(),
        };
        this.users[index].conversations.push(conversation);
        resolve(conversation);
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Get a conversation
   * @param {string} userId - user id
   * @param {number} conversationId - conversation id
   * @returns {Query|*} - promise
   */
  getConversation(userId, conversationId) {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.users, { botId: this.botId, userId });
      if (index !== -1) {
        const user = this.users[index];
        const conversationIndex = _.findIndex(user.conversations, { id: conversationId });
        if (conversationIndex !== -1) {
          resolve(user.conversations[conversationIndex]);
        } else {
          reject('Conversation not found');
        }
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Get user conversations
   * @param {string} userId - user id
   * @returns {Query|*} - promise
   */
  getConversations(userId) {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.users, { botId: this.botId, userId });
      if (index !== -1) {
        resolve(this.users[index].conversations);
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Get user last conversation
   * @param {string} userId - user id
   * @returns {Query|*} - promise
   */
  getLastConversation(userId) {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.users, { botId: this.botId, userId });
      if (index !== -1) {
        const lastIndex = this.users[index].conversations.length - 1;
        resolve(this.users[index].conversations[lastIndex]);
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Update a conversation
   * @param {string} userId - user id
   * @param {number} conversationId - conversation id
   * @param {object} data - conversation data object
   * @returns {Query|*} - promise
   */
  updateConversation(userId, conversationId, data) {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.users, { botId: this.botId, userId });
      if (index !== -1) {
        const user = this.users[index];
        const conversationIndex = _.findIndex(user.conversations, { id: conversationId });
        if (conversationIndex !== -1) {
          const newConversationData = _.extend(user.conversations[conversationIndex].data, data);
          this.users[index].conversations[conversationIndex].data = newConversationData;
          resolve(this.users[index].conversations[conversationIndex]);
        } else {
          reject('Conversation not found');
        }
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Remove a conversation
   * @param {string} userId - user id
   * @param {number} conversationId - conversation id
   * @returns {Query|*} - promise
   */
  removeConversation(userId, conversationId) {
    return new Promise((resolve, reject) => {
      const userIndex = _.findIndex(this.users, { botId: this.botId, userId });
      if (userIndex !== -1) {
        const user = this.users[userIndex];
        const conversationIndex = _.findIndex(user.conversations, { id: conversationId });
        if (conversationIndex !== -1) {
          this.users[userIndex].conversations = _.pullAt(
            this.users[userIndex].conversations,
            conversationIndex,
          );
          resolve(`Conversation ${conversationId} has been removed from user ${userId}`);
        } else {
          reject('Conversation not found');
        }
      } else {
        reject('User not found');
      }
    });
  }
}
