const mongoose = require('mongoose');
const _ = require('lodash');

/**
 * User model
 */
const userSchema = new mongoose.Schema({
  botId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    validate: {
      validator: data => data instanceof Object,
      message: 'Error: user data is not an Object',
    },
    default: {},
  },
  conversations: [{
    data: {
      type: Object,
      validate: {
        validator: data => data instanceof Object,
        message: 'Error: user data is not an Object',
      },
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  }],
  dialogs: [{
    label: String,
    entities: Object,
  }],
  lastDialog: {
    label: String,
    entities: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// flatten user data
userSchema.methods.flatten = function flatten() {
  let user = this.toObject();
  if (!user.data) {
    return user;
  } else {
    const data = _.pick(user, 'data').data; // get data
    _.unset(user, 'data'); // unset data on flat obj
    return _.extend(user, data); // extend data props to obj and return
  }
};

// get last conversation flattened
userSchema.methods.getLastConversation = function getLastConversation() {
  let lastConversation = this.conversations[this.conversations.length - 1].toObject();
  if (!lastConversation.data) {
    return lastConversation;
  } else {
    const data = _.pick(lastConversation, 'data').data; // get data
    _.unset(lastConversation, 'data'); // unset data on flat obj
    return _.extend(lastConversation, data); // extend data props to obj and return
  }
};

// set last conversation key
userSchema.methods.lastConversationSet = function lastConversationSet(key, value) {
  this.conversations[this.conversations.length - 1].set(key, value);
};

// get last conversation key
userSchema.methods.lastConversationGet = function lastConversationGet(key) {
  return this.conversations[this.conversations.length - 1][key];
};

// ensure uniqueness with both botId and userId by creating an index
userSchema.index({ botId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
