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
   * Get user index
   * @private
   * @param {string} userId - user id
   * @returns {number|*}
   */
  getUserIndex(userId) {
    return _.findIndex(this.users, { botId: this.botId, userId });
  }

  /**
   * Get conversation index
   * @private
   * @param {number} userIndex - user index
   * @param {number} conversationId - conversation id
   * @returns {number|*}
   */
  getConversationIndex(userIndex, conversationId) {
    return _.findIndex(this.users[userIndex].conversations, { id: conversationId });
  }

  /**
   * Verify if user exist
   * @private
   * @param {string} userId - user id
   * @returns {Promise}
   */
  verifyUser(userId) {
    return new Promise((resolve, reject) => {
      const userIndex = this.getUserIndex(userId);
      if (userIndex !== -1) {
        resolve(userIndex);
      } else {
        reject('User not found');
      }
    });
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  addUser(userId) {
    return new Promise((resolve, reject) => {
      const index = this.getUserIndex(userId);
      if (index === -1) {
        const newUser = {
          botId: this.botId,
          userId,
          conversations: [],
          dialogs: [],
          lastDialog: {},
          responses: [],
          createdAt: Date.now(),
        };
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
   * @returns {Promise}
   */
  getUser(userId) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then(userIndex => resolve(this.users[userIndex]))
        .catch(message => reject(message));
    });
  }

  /**
   * Update an user
   * @param {string} userId - user id
   * @param {Object} updates - user updates
   * @returns {Promise}
   */
  updateUser(userId, updates) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          this.users[userIndex] = _.extend(this.users[userIndex], updates);
          resolve(this.users[userIndex]);
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Remove an user
   * @param {string} userId - user id
   * @returns {Promise}
   */
  removeUser(userId) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          this.users = _.pullAt(this.users, userIndex);
          resolve(`User ${userId} has been removed`);
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Add a conversation to an user
   * @param {string} userId - user id
   * @param {object} data - conversation data object
   * @returns {Promise}
   */
  addConversation(userId, data) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          const conversation = {
            id: this.users[userIndex].conversations.length,
            data,
            createdAt: Date.now(),
          };
          this.users[userIndex].conversations.push(conversation);
          resolve(conversation);
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Get a conversation
   * @param {string} userId - user id
   * @param {number} conversationId - conversation id
   * @returns {Promise}
   */
  getConversation(userId, conversationId) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          const user = this.users[userIndex];
          const conversationIndex = this.getConversationIndex(userIndex, conversationId);
          if (conversationIndex !== -1) {
            resolve(user.conversations[conversationIndex]);
          } else {
            reject('Conversation not found');
          }
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Get user conversations
   * @param {string} userId - user id
   * @returns {Promise}
   */
  getConversations(userId) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then(userIndex => resolve(this.users[userIndex].conversations))
        .catch(message => reject(message));
    });
  }

  /**
   * Get user last conversation
   * @param {string} userId - user id
   * @returns {Promise}
   */
  getLastConversation(userId) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          const lastIndex = this.users[userIndex].conversations.length - 1;
          resolve(this.users[userIndex].conversations[lastIndex] || null);
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Update a conversation
   * @param {string} userId - user id
   * @param {number} conversationId - conversation id
   * @param {object} data - conversation data object
   * @returns {Promise}
   */
  updateConversation(userId, conversationId, data) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          const conversationIndex = this.getConversationIndex(userIndex, conversationId);
          if (conversationIndex !== -1) {
            this.users[userIndex].conversations[conversationIndex].data = _.extend(
              this.users[userIndex].conversations[conversationIndex].data,
              data,
            );
            resolve(this.users[userIndex].conversations[conversationIndex]);
          } else {
            reject('Conversation not found');
          }
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Remove a conversation
   * @param {string} userId - user id
   * @param {number} conversationId - conversation id
   * @returns {Promise}
   */
  removeConversation(userId, conversationId) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          const conversationIndex = this.getConversationIndex(userIndex, conversationId);
          if (conversationIndex !== -1) {
            this.users[userIndex].conversations.splice(conversationIndex, 1);
            resolve(`Conversation ${conversationId} has been removed from user ${userId}`);
          } else {
            reject('Conversation not found');
          }
        })
        .catch(message => reject(message));
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
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          this.users[userIndex][key] = value;
          resolve();
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Get a key in user scope
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  get(userId, key) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then(userIndex => resolve(this.users[userIndex][key]))
        .catch(message => reject(message));
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
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          if (_.isArray(this.users[userIndex][key])) {
            this.users[userIndex][key].push(value);
            resolve(this.users[userIndex]);
          } else {
            reject(`Key ${key} is not an array`);
          }
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Pop from an array key in user scope - (last element)
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  pop(userId, key) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          if (_.isArray(this.users[userIndex][key])) {
            resolve(this.users[userIndex][key].pop());
          } else {
            reject(`Key ${key} is not an array`);
          }
        })
        .catch(message => reject(message));
    });
  }

  /**
   * Shift from an array key in user scope - (first element)
   * @param {string} userId - user id
   * @param {string} key - user key
   * @returns {Promise}
   */
  shift(userId, key) {
    return new Promise((resolve, reject) => {
      this.verifyUser(userId)
        .then((userIndex) => {
          if (_.isArray(this.users[userIndex][key])) {
            resolve(this.users[userIndex][key].shift());
          } else {
            reject(`Key ${key} is not an array`);
          }
        })
        .catch(message => reject(message));
    });
  }
}
