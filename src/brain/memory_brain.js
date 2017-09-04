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
  }

  /**
   * Add an user
   * @param {string} userId - user id
   * @returns {Query|*} - promise
   */
  addUser(userId) {
    return User.create({ botId: this.botId, userId });
  }

  /**
   * Get an user
   * @param {string} userId - user id
   * @returns {Query|*} - promise
   */
  getUser(userId) {
    return User.findOne({ botId: this.botId, userId });
  }

  /**
   * Update an user
   * @param {string} userId - user id
   * @param {Object} updates - user updates
   * @returns {Query|*} - promise
   */
  updateUser(userId, updates) {
    return User.findOneAndUpdate({ botId: this.botId, userId }, updates);
  }

  /**
   * Remove an user
   * @param {string} userId - user id
   * @returns {Query|*} - promise
   */
  removeUser(userId) {
    return User.remove({ botId: this.botId, userId });
  }

  /**
   * Add a conversation to an user
   * @param {string} userId - user id
   * @param {object} metadata - conversation metadata object
   * @returns {Query|*} - promise
   */
  addConversation(userId, metadata) {
    return new Promise((resolve, reject) => {
      User.findOne({ botId: this.botId, userId })
        .then((user) => {
          const conversation = new Conversation({ user, metadata });
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
   * @returns {Query|*} - promise
   */
  getConversation(conversationId) {
    return Conversation.findOne({ _id: conversationId });
  }

  /**
   * Get user conversations
   * @param {ObjectId} userId - user mongodb id
   * @returns {Query|*} - promise
   */
  getConversations(userId) {
    return Conversation.find({ user: userId });
  }

  /**
   * Get user last conversation
   * @param {ObjectId} userId - user id
   * @returns {Query|*} - promise
   */
  getLastConversation(userId) {
    return Conversation.findOne({ user: userId }).sort('-createdAt').exec();
  }

  /**
   * Update a conversation
   * @param {ObjectId} conversationId - conversation id
   * @param {object} metadata - conversation metadata object
   * @returns {Query|*} - promise
   */
  updateConversation(conversationId, metadata) {
    return new Promise((resolve, reject) => {
      Conversation.findOne({ _id: conversationId }, 'metadata')
        .then((conversation) => {
          const newMetadata = _.extend(conversation.metadata, metadata);
          Conversation.findOneAndUpdate(
            { _id: conversationId },
            { $set: { metadata: newMetadata } },
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
   * @returns {Query|*} - promise
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
}
